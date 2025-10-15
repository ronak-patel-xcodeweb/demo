'use client'

import { useEffect, useRef, useState } from 'react'
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
import { Dialog, DialogClose, DialogContent, DialogTitle } from '../ui/dialog'
import AllAgentServices from '../agentservices/agentservicestype'
import { toast } from 'sonner'
const agentCountyWise = [
  {
    country: 'India', agentsData: [{
      name: 'Jessica',
      age: '32',
      sex: 'Female',
      requested: false
    },
    {
      name: 'Mark',
      age: '35',
      sex: 'Male',
      requested: false
    },
    {
      name: 'David',
      age: '30',
      sex: 'Male',
      requested: false
    }]
  },
  {
    country: 'United States of America', agentsData: [{
      name: 'James',
      age: '32',
      sex: 'Male',
      requested: false
    },
    {
      name: 'Michael',
      age: '35',
      sex: 'Male',
      requested: false
    },
    {
      name: 'Jennifer',
      age: '30',
      sex: 'Female',
      requested: false
    }]
  },
  {
    country: 'United Kingdom', agentsData: [{
      name: 'Mary',
      age: '32',
      sex: 'Female',
      requested: false
    },
    {
      name: 'Patricia',
      age: '35',
      sex: 'Male',
      requested: false
    },
    {
      name: 'John',
      age: '30',
      sex: 'Male',
      requested: false
    }]
  },
]
const TacticalMapView = ({ themeColor, mapColor }: any) => {
  const mapRef = useRef<any>()
  const [selectedCountry, setSelectedCountry] = useState<any>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [anchorPos, setAnchorPos] = useState<{ x: number; y: number } | null>(null)
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);

  const getRandomColor = () =>
    `#${Math.floor(Math.random() * 16777215).toString(16)}`

  useEffect(() => {
    const countryBorderColors: Record<string, string> = {};
    agentCountyWise.forEach(country => {
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
    tooltipEl.className = 'absolute bg-black text-white px-2 py-1 rounded text-sm pointer-events-none';
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
        const agentData = agentCountyWise.find(agentCountyWise => agentCountyWise.country === name)
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

      if (hoverFeature) {
        const name = hoverFeature.get('name');
        const agentData = agentCountyWise.find(c => c.country === name);
        const agentCount = agentData?.agentsData.length || 0;

        tooltipEl.innerHTML = `${agentCount} Agent${agentCount !== 1 ? 's' : ''}`;
        tooltipEl.style.display = 'block';
        tooltipOverlay.setPosition(evt.coordinate);
      } else {
        tooltipEl.style.display = 'none';
      }
    });


    return () => map.setTarget(undefined);
  }, []);


  const requestSend: any = (data: string, serviceName: string) => {
    const updatedAgents = selectedCountry?.agentsData.map((agent: any) => {
      if (agent.name === data) {
        return { ...agent, serviceName: serviceName, requested: true };
      }
      return agent;
    });

    setSelectedCountry((prev: any) => ({
      ...prev,
      agentsData: updatedAgents,
    }));
    toast.success(`You have successfully sent a request to ${data} for ${serviceName}.`)
    setServiceDialogOpen(false);
    setSelectedAgent([]);
  };


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
                    <h5 className='mb-3 text-center'>Agents details
                    </h5>
                    {selectedCountry.agentsData.length > 0 && (
                      <div className='max-h-[20rem] w-full overflow-hidden overflow-y-auto' >
                        {selectedCountry?.agentsData?.map((agent: any, index: number) => (
                          <div key={index} className='border-b border-black m-2 '>
                            <div className="flex items-center justify-between gap-5">
                              <div>
                                <div>
                                  Agent Name: {agent?.name}
                                </div>
                                <div>
                                  Agent age: {agent?.age}
                                </div>
                                <div>
                                  Agent sex: {agent?.sex}
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
                                      {agent?.requested == true && (<>
                                        <div className='flex justify-end'>
                                          <VerifyButton />
                                        </div>
                                        <p>{agent?.serviceName}</p>
                                      </>)}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    {agent?.requested == false && (<p>Request an Agent</p>)}
                                    {agent?.requested == true && (<p>Requested</p>)}
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                            </div>
                            <div >
                              <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
                                <DialogContent className='w-full h-[95%] overflow-auto'>
                                  <div className="flex justify-between items-center mb-3">
                                    <DialogTitle>Available Services for {selectedAgent?.name}</DialogTitle>
                                  </div>
                                  <AllAgentServices onRequest={(data) => requestSend(selectedAgent.name, data)} />
                                </DialogContent>
                              </Dialog>
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

      </div>
    </>
  )
}

export default TacticalMapView

