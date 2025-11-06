'use client'

import { useContext, useEffect, useRef, useState } from 'react'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Fill, Stroke, Text } from 'ol/style'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { RequestButtonSvg } from '../svgs/request-button'
import { VerifyButton } from '../svgs/verifed-button'

import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay'
import { Button } from '../ui/button'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import AllAgentServices from '../agentservices/agentservicestype'
import { toast } from 'sonner'
import { DataTableContext, ServicesContext } from '../context/DataTableContext'
import { useSession } from 'next-auth/react'
import SpinnerComponent from '../spinner/spinner'
import { Separator } from '../ui/separator'

const TacticalMapView = ({ themeColor, mapColor, agent }: any) => {

  const { allServices, setAllServices } = useContext(ServicesContext);


  const { dataTables, setDataTables } = useContext(DataTableContext);
  const { data: session }: any = useSession();

  const [agentCountyWise, SetAgentCountyWise] = useState<any>();
  useEffect(() => {
    SetAgentCountyWise(agent);
  }, [agent])
  const mapRef = useRef<any>()
  const [selectedCountry, setSelectedCountry] = useState<any>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [anchorPos, setAnchorPos] = useState<{ x: number; y: number } | null>(null)
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`

  useEffect(() => {
    const countryBorderColors: Record<string, string> = {};
    agentCountyWise?.forEach((country: any) => {
      countryBorderColors[country.country] = getRandomColor();
    });

    const worldSource = new VectorSource({
      url: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json',
      format: new GeoJSON(),
    });

    const styleFunction = (feature: any, isHover = false) => {
      const name = feature.get('name');
      const hasAgent = name in countryBorderColors;

      return new Style({
        fill: new Fill({
          color: hasAgent && isHover ? '#03c9c3ff' : hasAgent ? '#00CEC888' : mapColor,
        }),
        stroke: new Stroke({
          color: hasAgent ? '#fff' : '#555555',
          width: hasAgent ? (isHover ? 3 : 2) : 1,
        }),
      });
    };

    const countryLayer = new VectorLayer({
      source: worldSource,
      style: feature => styleFunction(feature, false),
    });

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}.png',
          }),
          className: themeColor,
        }),
        countryLayer,
      ],
      view: new View({
        center: fromLonLat([0, 20]),
        zoom: 2,
        minZoom: 2,
        maxZoom: 6,
      }),
      controls: [],
    });

    const tooltipEl = document.createElement('div');
    tooltipEl.className = `
  absolute bg-black/90 text-white text-xs font-medium rounded-lg shadow-lg 
  px-3 py-2 pointer-events-none border border-white/20 whitespace-nowrap
`;
    tooltipEl.style.display = 'none';
    mapRef.current.appendChild(tooltipEl);

    const tooltipOverlay = new Overlay({
      element: tooltipEl,
      offset: [10, 0],
      positioning: 'bottom-left',
    });
    map.addOverlay(tooltipOverlay);

    map.on('singleclick', evt => {
      map.forEachFeatureAtPixel(evt.pixel, feature => {
        const name = feature.get('name')
        const agentData = agentCountyWise?.find((agentCountyWise: any) => agentCountyWise?.country === name)
        if (agentData) {
          const pixel = evt.pixel
          setAnchorPos({ x: pixel[0], y: pixel[1] })
          setSelectedCountry(agentData)
          setPopoverOpen(true)
        } else {
          setPopoverOpen(false)
        }
      })
    })
    map.on('pointermove', evt => {
      let hoverFeature: any = null;

      map.forEachFeatureAtPixel(evt.pixel, feature => {
        const f = feature as Feature;
        const name = feature.get('name');
        if (name in countryBorderColors) {
          hoverFeature = feature;
          f.setStyle(styleFunction(feature, true));
        }
      });

      (countryLayer?.getSource()?.getFeatures() as Feature[] | undefined)?.forEach(f => {
        if (f !== hoverFeature) f.setStyle(styleFunction(f, false));
      });

      const mapTarget = map.getTargetElement();

      if (hoverFeature) {
        const name = hoverFeature.get('name');
        const agentData = agentCountyWise?.find((c: any) => c.country === name);
        const agentCount = agentData?.agentsData.length || 0;

        tooltipEl.innerHTML = `${agentCount} Agent${agentCount === 1 ? '' : 's'}`;
        tooltipEl.style.display = 'block';
        tooltipOverlay.setPosition(evt.coordinate);

        mapTarget.style.cursor = 'pointer';
      } else {
        tooltipEl.style.display = 'none';
        mapTarget.style.cursor = '';
      }
    });



    return () => map.setTarget(undefined);
  }, [agentCountyWise]);


  const requestSend = async (agentId: string, agentName: string, requestData: any) => {

    setIsLoading(true)
    const agentRequestTableId = dataTables.find((t: any) => t?.table_name === "AgentRequests")?.id;
    const scheduleTableId = dataTables.find((t: any) => t?.table_name === "Schedule")?.id;
    const userTableId = dataTables.find((t: any) => t?.table_name === "User")?.id;


    const payloadRequestData = {
      agentRequestTableId,
      scheduleTableId,
      agentId: agentId,
      serviceId: requestData.serviceId,
      serviceName: getServiceName(requestData.serviceId),
      meetingType: requestData.meetingType,
      message: requestData.message,
      companyId: session?.user?.id,
      companyName: session?.user?.name,
      agentName
    }
    const formData = new FormData();
    formData.append("requestData", JSON.stringify(payloadRequestData));
    formData.append("agentRequestTableId", agentRequestTableId);
    formData.append("scheduleTableId", scheduleTableId);
    formData.append("userTableId", userTableId);


    setServiceDialogOpen(false);
    const response = await fetch("/api/AddRequests", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      setIsLoading(false);
      const updatedAgents = selectedCountry?.agentsData.map((agent: any) => {
        if (agent.Id === agentId) {
          return { ...agent, serviceName: requestData.serviceName, message: requestData.message, meetingType: requestData.meetingType, requested: true };
        }
        return agent;
      });

      setSelectedCountry((prev: any) => ({
        ...prev,
        agentsData: updatedAgents,
      }));
      toast.success(`You have successfully sent a request to ${agentName} for ${requestData.serviceName}.`)
      setSelectedAgent([]);
    }
    else {
      setIsLoading(false)
    }
  };

  const getServiceName = (id: any) => {
    const data = allServices.find((data: any) => data?.Id == id)
    return data?.ServiceName
  }

  return (
    <>
      <div className="relative w-full h-full bg-[#0a0a0a] rounded-xl shadow-lg overflow-hidden">
        <div ref={mapRef} className="absolute inset-0" />
        {selectedCountry && anchorPos && (
          <div>

            <Popover open={popoverOpen}>
              <PopoverTrigger asChild>
                <div
                  style={{
                    position: 'absolute',
                    top: anchorPos.y,
                    left: anchorPos.x,
                    width: 1,
                    height: 1,
                  }}
                />
              </PopoverTrigger>
              <PopoverContent>
                <div>
                  <div className="mb-1 border-b-2 border-black flex items-center justify-between">
                    <div>
                      {selectedCountry.country}
                    </div>
                    <div>
                      <Button onClick={() => setPopoverOpen(false)} className="bg-transparent hover:bg-transparent cursor-pointer text-white">
                        X
                      </Button>
                    </div>
                  </div>
                  <div>
                    <h5 className='text-center'>Agents details
                    </h5>
                    {selectedCountry.agentsData.length > 0 && (
                      <div className='max-h-[20rem] w-full overflow-hidden overflow-y-auto' >
                        {selectedCountry?.agentsData?.map((agent: any, index: number) => (
                          <div key={index} className='border-b border-black m-2 '>
                            <div className="flex items-center justify-between gap-5">
                              <div>
                                <div className="break-words max-w-[20rem]">
                                  {agent?.name}
                                </div>
                              </div>

                              <div>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div onClick={() => {
                                      setServiceDialogOpen(true)
                                      setSelectedAgent(agent)
                                    }} className='cursor-pointer'>
                                      {agent?.requested == false && (<RequestButtonSvg />)}
                                    </div>
                                    <div>
                                      {agent?.requested == true && (<>
                                        <div className='flex justify-end'>
                                          <VerifyButton />
                                        </div>                                      </>)}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {agent?.requested == false && (<p>Request an Agent</p>)}
                                    {agent?.requested == true && (<p>{getServiceName(agent?.serviceName) ?? agent?.serviceName}</p>)}
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>

          </div>
        )}
        {isLoading && (
          <SpinnerComponent />
        )}
        <div >
          <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
            <DialogContent className='w-full h-[95%] overflow-auto'>
              <DialogHeader>        <DialogTitle>Available Services for {selectedAgent?.name}</DialogTitle>
              </DialogHeader>
              <Separator />
              <AllAgentServices onRequest={(data) => requestSend(selectedAgent.Id, selectedAgent?.name, data)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  )
}

export default TacticalMapView