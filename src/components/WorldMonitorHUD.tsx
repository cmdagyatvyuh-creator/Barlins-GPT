import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import {
  Globe,
  Clock,
  Activity,
  Server,
  Radio,
  Shield,
  Zap,
  X,
  RefreshCw,
  Cpu,
  Wifi,
  Sparkles,
  Layers,
  Search,
  Maximize2,
  Video,
  TrendingUp,
  Anchor,
  Flame,
  AlertTriangle,
  Compass,
  DollarSign,
  BarChart2,
  Plane,
  Eye,
  CheckSquare,
  Square,
  MessageSquare,
  Send,
  ExternalLink,
  ChevronDown,
  Lock,
  Plus,
  Volume2,
  Sliders,
  Settings,
  User,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Grid,
  Maximize,
  HelpCircle
} from 'lucide-react';
import { soundFx } from '../utils/soundFx';

interface WorldMonitorHUDProps {
  isOpen: boolean;
  onClose: () => void;
  onConsultBarlinGptWorld: (promptText: string) => void;
}

interface MapMarkerItem {
  id: string;
  title: string;
  category: 'intel' | 'conflict' | 'base' | 'nuclear' | 'pipeline' | 'chokepoint';
  lat: number;
  lng: number;
  status: string;
  risk: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'STABLE';
  details: string;
}

const GLOBAL_MARKERS: MapMarkerItem[] = [
  {
    id: 'm1',
    title: 'Strait of Hormuz Naval Zone',
    category: 'chokepoint',
    lat: 26.56,
    lng: 56.25,
    status: 'WAR ZONE // NAVAL BLOCKADE RISK',
    risk: 'CRITICAL',
    details: 'Persian Gulf transit point. Traffic down 63% vs 30-day baseline. Vessels turning off AIS.'
  },
  {
    id: 'm2',
    title: 'Bab-el-Mandeb & Red Sea Corridor',
    category: 'conflict',
    lat: 12.58,
    lng: 43.33,
    status: 'ANTI-SHIP MISSILE THREAT',
    risk: 'CRITICAL',
    details: 'Maritime security warning in effect. Commercial shipping rerouting around Cape of Good Hope.'
  },
  {
    id: 'm3',
    title: 'Zaporizhzhia Energy Complex',
    category: 'nuclear',
    lat: 47.51,
    lng: 34.58,
    status: 'MONITORED NUCLEAR ZONE',
    risk: 'HIGH',
    details: 'IAEA inspectors on standby. Backup power grid line status unstable.'
  },
  {
    id: 'm4',
    title: 'Diego Garcia Naval Facility',
    category: 'base',
    lat: -7.31,
    lng: 72.42,
    status: 'US/UK FORWARD OPERATING BASE',
    risk: 'STABLE',
    details: 'Strategic bomber and submarine support hub in Central Indian Ocean.'
  },
  {
    id: 'm5',
    title: 'Taiwan Strait Monitoring Arc',
    category: 'intel',
    lat: 24.0,
    lng: 119.5,
    status: 'ELEVATED AIR & NAVAL PATROLS',
    risk: 'ELEVATED',
    details: 'Multiple naval carrier strike groups deployed in surrounding international waters.'
  },
  {
    id: 'm6',
    title: 'Nord Stream Pipeline Hub',
    category: 'pipeline',
    lat: 55.5,
    lng: 15.8,
    status: 'INFRASTRUCTURE MONITORING',
    risk: 'ELEVATED',
    details: 'Baltic seabed sonar watch active. Energy security alert maintained by NATO maritime command.'
  },
  {
    id: 'm7',
    title: 'Sudan Conflict Corridor',
    category: 'conflict',
    lat: 15.5,
    lng: 32.53,
    status: 'ACTIVE HOSTILITIES',
    risk: 'CRITICAL',
    details: 'Khartoum & Darfur humanitarian and security monitoring zone.'
  },
  {
    id: 'm8',
    title: 'Yokosuka Naval Base',
    category: 'base',
    lat: 35.28,
    lng: 139.67,
    status: '7TH FLEET HEADQUARTERS',
    risk: 'STABLE',
    details: 'Pacific naval readiness hub and carrier strike group homeport.'
  }
];

export const WorldMonitorHUD: React.FC<WorldMonitorHUDProps> = ({
  isOpen,
  onClose,
  onConsultBarlinGptWorld
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Active Main Tab: 'Main' (Interactive GIS Map) vs 'Commodity' (Dashboard Grid)
  const [activeMainTab, setActiveMainTab] = useState<'Main' | 'Commodity'>('Main');

  // UTC Clock State
  const [utcTimeStr, setUtcTimeStr] = useState<string>('');
  
  // Map View settings
  const [viewMode, setViewMode] = useState<'2D' | '3D'>('2D');
  const [selectedNewsChannel, setSelectedNewsChannel] = useState<string>('BLOOMBERG');
  
  // Layer Toggles matching worldmonitor.app UI exactly
  const [layers, setLayers] = useState({
    intelHotspots: true,
    conflictZones: true,
    militaryBases: true,
    nuclearSites: true,
    gammaIrradiators: false,
    radiationWatch: false,
    spaceports: false,
    underseaCables: false,
    pipelines: true,
    sanctions: true,
    weather: true,
    economic: true,
    waterways: true,
    natural: false
  });

  const [searchLayerQuery, setSearchLayerQuery] = useState('');
  const [barlinCustomPrompt, setBarlinCustomPrompt] = useState('');
  const [myMonitorInput, setMyMonitorInput] = useState('');
  const [userMonitors, setUserMonitors] = useState<string[]>(['Oil / Hormuz', 'Gold Futures']);

  // Update UTC Clock
  useEffect(() => {
    if (!isOpen) return;
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC',
        hour12: false
      };
      setUtcTimeStr(now.toLocaleDateString('en-US', options).toUpperCase() + ' UTC');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Initialize Leaflet Map when in 'Main' tab
  useEffect(() => {
    if (!isOpen || activeMainTab !== 'Main' || !mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [20, 15],
        zoom: 2,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Dark map tiles matching screenshot perfectly
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      leafletMapRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
    }

    setTimeout(() => {
      leafletMapRef.current?.invalidateSize();
    }, 200);

  }, [isOpen, activeMainTab]);

  // Render Map Markers based on Layer Toggles
  useEffect(() => {
    if (!leafletMapRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    GLOBAL_MARKERS.forEach(marker => {
      let shouldShow = false;
      if (marker.category === 'intel' && layers.intelHotspots) shouldShow = true;
      if (marker.category === 'conflict' && layers.conflictZones) shouldShow = true;
      if (marker.category === 'base' && layers.militaryBases) shouldShow = true;
      if (marker.category === 'nuclear' && layers.nuclearSites) shouldShow = true;
      if (marker.category === 'pipeline' && layers.pipelines) shouldShow = true;
      if (marker.category === 'chokepoint' && layers.waterways) shouldShow = true;

      if (!shouldShow) return;

      let color = '#00f3ff';
      if (marker.risk === 'CRITICAL') color = '#ef4444';
      else if (marker.risk === 'HIGH') color = '#f97316';
      else if (marker.risk === 'ELEVATED') color = '#eab308';
      else if (marker.category === 'base') color = '#3b82f6';

      const circle = L.circleMarker([marker.lat, marker.lng], {
        radius: marker.risk === 'CRITICAL' ? 10 : 7,
        fillColor: color,
        color: '#ffffff',
        weight: 1.5,
        opacity: 0.9,
        fillOpacity: 0.8
      });

      const popupHtml = `
        <div style="font-family: monospace; background: #080c16; color: #f8fafc; padding: 12px; border: 1px solid ${color}; border-radius: 6px; min-width: 240px; box-shadow: 0 0 15px rgba(0,0,0,0.8);">
          <div style="font-weight: bold; font-size: 13px; color: ${color};">${marker.title}</div>
          <div style="font-size: 10px; color: #94a3b8; margin-top: 3px; font-weight: 600;">STATUS: ${marker.status}</div>
          <div style="font-size: 11px; margin-top: 8px; line-height: 1.4; color: #cbd5e1;">${marker.details}</div>
          <div style="margin-top: 10px; text-align: right;">
            <button id="btn-consult-${marker.id}" style="background: rgba(16,185,129,0.2); border: 1px solid #10b981; color: #10b981; padding: 5px 10px; font-size: 10px; font-weight: bold; border-radius: 4px; cursor: pointer; transition: all 0.2s;">
              ⚡ CONSULT BARLIN GPT
            </button>
          </div>
        </div>
      `;

      circle.bindPopup(popupHtml);

      circle.on('popupopen', () => {
        setTimeout(() => {
          const btn = document.getElementById(`btn-consult-${marker.id}`);
          if (btn) {
            btn.onclick = () => {
              soundFx.playSuccess();
              onConsultBarlinGptWorld(`Barlin GPT, provide a deep geopolitical and risk assessment for ${marker.title}. Status: ${marker.status}. Details: ${marker.details}`);
              onClose();
            };
          }
        }, 100);
      });

      markersGroupRef.current?.addLayer(circle);
    });

  }, [layers, isOpen, activeMainTab]);

  if (!isOpen) return null;

  const toggleLayer = (key: keyof typeof layers) => {
    soundFx.playClick();
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAddMonitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myMonitorInput.trim()) return;
    setUserMonitors(prev => [...prev, myMonitorInput.trim()]);
    setMyMonitorInput('');
    soundFx.playClick();
  };

  const handleAskBarlinCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barlinCustomPrompt.trim()) return;
    soundFx.playSuccess();
    onConsultBarlinGptWorld(barlinCustomPrompt);
    setBarlinCustomPrompt('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 text-gray-100 font-mono select-none animate-fadeIn overflow-hidden">
      <div className="relative w-full h-full bg-[#05070a] flex flex-col overflow-hidden">
        
        {/* 1. TOP GREEN PRO BANNER (Exact screenshot replica) */}
        <div className="w-full bg-[#031c12] border-b border-[#054a30] text-[#10b981] px-4 py-1 flex items-center justify-between text-xs font-sans">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <span className="px-1.5 py-0.5 bg-[#10b981] text-black font-bold text-[10px] rounded uppercase">PRO</span>
            <span className="font-semibold text-emerald-200 text-[11px]">
              Pro is launched — More Signal, Less Noise. More AI Briefings. A Geopolitical & Equity Researcher just for you.
            </span>
          </div>
          <button
            onClick={() => {
              soundFx.playSuccess();
              onConsultBarlinGptWorld("Barlin GPT, give me an elite Pro-level geopolitical & equity research briefing.");
              onClose();
            }}
            className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#10b981] hover:underline whitespace-nowrap"
          >
            Upgrade to Pro →
          </button>
        </div>

        {/* 2. TOP MAIN NAVIGATION BAR */}
        <div className="w-full bg-[#080b12] border-b border-[#1b2234] px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Logo Group */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setActiveMainTab('Main'); soundFx.playClick(); }}
                className="w-7 h-7 rounded bg-[#10b981]/20 border border-[#10b981] flex items-center justify-center text-[#10b981] hover:bg-[#10b981]/30"
              >
                <Globe className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => { setActiveMainTab('Commodity'); soundFx.playClick(); }}
                className={`px-2 py-1 text-[11px] font-bold rounded border ${
                  activeMainTab === 'Commodity'
                    ? 'bg-[#10b981] text-black border-[#10b981]'
                    : 'bg-[#121826] text-emerald-400 border-[#10b981]/40 hover:bg-[#10b981]/20'
                }`}
              >
                COMMODIT
              </button>

              <span className="font-bold text-white tracking-widest text-sm flex items-center gap-2 font-orbitron">
                MONITOR <span className="text-[10px] text-gray-400 font-mono">v2.10.0 @eliehabib</span>
              </span>
            </div>

            {/* Status Pills */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>

              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#121826] border border-[#1e273a] text-gray-300 text-[11px]">
                <span>Global</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </div>

              <span className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                MISSION
              </span>

              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-900/30 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>DEFCON 5</span>
                <span className="text-gray-400">0%</span>
              </div>

              <span className="px-1.5 py-0.5 rounded-full bg-orange-500 text-black font-extrabold text-[10px]">
                26
              </span>
            </div>

          </div>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                soundFx.playSuccess();
                onConsultBarlinGptWorld("Barlin GPT, summarize current high-alert geopolitical intelligence for me.");
                onClose();
              }}
              className="px-2.5 py-1 bg-[#10b981]/15 hover:bg-[#10b981]/30 border border-[#10b981] text-[#10b981] text-[11px] font-bold rounded flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline">BARLIN GPT RESEARCH</span>
            </button>

            <button
              onClick={() => { soundFx.playClick(); onClose(); }}
              className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 text-red-400 transition ml-2"
              title="Close Monitor HUD"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3. SECONDARY TAB BAR ('Main' vs 'Commodity') */}
        <div className="w-full bg-[#0b0f19] border-b border-[#1b2234] px-3 py-1 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setActiveMainTab('Main'); soundFx.playClick(); }}
              className={`px-3 py-1 text-[11px] font-bold rounded-t border-t border-x ${
                activeMainTab === 'Main'
                  ? 'bg-[#10b981] text-black border-[#10b981]'
                  : 'bg-[#121826] text-gray-400 border-[#1b2234] hover:text-white'
              }`}
            >
              Main
            </button>
            <button
              onClick={() => { setActiveMainTab('Commodity'); soundFx.playClick(); }}
              className={`px-3 py-1 text-[11px] font-bold rounded-t border-t border-x ${
                activeMainTab === 'Commodity'
                  ? 'bg-[#10b981] text-black border-[#10b981]'
                  : 'bg-[#121826] text-gray-400 border-[#1b2234] hover:text-white'
              }`}
            >
              Commodity & Macro
            </button>
            <button className="px-2 py-1 text-gray-500 hover:text-white">
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeMainTab === 'Main' && (
            <div className="flex items-center gap-3 text-[11px] text-gray-300">
              <span className="font-bold text-gray-200">GLOBAL SITUATION</span>
              <span className="text-[#10b981] font-mono hidden sm:inline">{utcTimeStr || 'TUE, 11 AUG 2026 11:05:36 UTC'}</span>
              
              <div className="flex items-center bg-[#121826] border border-[#1b2234] rounded overflow-hidden">
                <button
                  onClick={() => setViewMode('2D')}
                  className={`px-2 py-0.5 text-[10px] font-bold ${viewMode === '2D' ? 'bg-[#10b981] text-black' : 'text-gray-400'}`}
                >
                  2D
                </button>
                <button
                  onClick={() => setViewMode('3D')}
                  className={`px-2 py-0.5 text-[10px] font-bold ${viewMode === '3D' ? 'bg-[#10b981] text-black' : 'text-gray-400'}`}
                >
                  3D
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. MAIN DISPLAY BODY */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          
          {/* ================= VIEW 1: MAIN INTERACTIVE GIS MAP VIEW ================= */}
          {activeMainTab === 'Main' && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              
              {/* Top Half: Map & Left Docked Layers Panel */}
              <div className="flex-1 flex relative min-h-[300px] border-b border-[#1b2234]">
                
                {/* Left Docked Layers Sidebar (Exact match to screenshot 1) */}
                <div className="w-60 sm:w-64 bg-[#090d16] border-r border-[#1b2234] flex flex-col p-3 z-10 overflow-y-auto">
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search layers ..."
                      value={searchLayerQuery}
                      onChange={e => setSearchLayerQuery(e.target.value)}
                      className="w-full pl-7 pr-2 py-1 text-[11px] bg-[#121826] border border-[#1e283d] rounded text-gray-200 focus:outline-none focus:border-[#10b981]"
                    />
                  </div>

                  {/* Layers Checklist */}
                  <div className="space-y-1 text-[11px] text-gray-300">
                    <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#121826] cursor-pointer">
                      <span className="flex items-center gap-2">
                        <input type="checkbox" checked={layers.intelHotspots} onChange={() => toggleLayer('intelHotspots')} className="accent-[#10b981]" />
                        <span className="text-emerald-400 font-bold">INTEL HOTSPOTS</span>
                      </span>
                      <Info className="w-3 h-3 text-gray-500" />
                    </label>

                    <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#121826] cursor-pointer">
                      <span className="flex items-center gap-2">
                        <input type="checkbox" checked={layers.conflictZones} onChange={() => toggleLayer('conflictZones')} className="accent-[#10b981]" />
                        <span className="text-red-400 font-bold">CONFLICT ZONES</span>
                      </span>
                      <Info className="w-3 h-3 text-gray-500" />
                    </label>

                    <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#121826] cursor-pointer">
                      <span className="flex items-center gap-2">
                        <input type="checkbox" checked={layers.militaryBases} onChange={() => toggleLayer('militaryBases')} className="accent-[#10b981]" />
                        <span className="text-blue-400 font-bold">MILITARY BASES</span>
                      </span>
                      <Info className="w-3 h-3 text-gray-500" />
                    </label>

                    <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#121826] cursor-pointer">
                      <span className="flex items-center gap-2">
                        <input type="checkbox" checked={layers.nuclearSites} onChange={() => toggleLayer('nuclearSites')} className="accent-[#10b981]" />
                        <span className="text-yellow-400 font-bold">NUCLEAR SITES</span>
                      </span>
                      <Info className="w-3 h-3 text-gray-500" />
                    </label>

                    <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#121826] cursor-pointer">
                      <span className="flex items-center gap-2">
                        <input type="checkbox" checked={layers.gammaIrradiators} onChange={() => toggleLayer('gammaIrradiators')} className="accent-[#10b981]" />
                        <span>GAMMA IRRADIATORS</span>
                      </span>
                      <Info className="w-3 h-3 text-gray-500" />
                    </label>

                    <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#121826] cursor-pointer">
                      <span className="flex items-center gap-2">
                        <input type="checkbox" checked={layers.radiationWatch} onChange={() => toggleLayer('radiationWatch')} className="accent-[#10b981]" />
                        <span>RADIATION WATCH</span>
                      </span>
                      <Info className="w-3 h-3 text-gray-500" />
                    </label>

                    <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#121826] cursor-pointer">
                      <span className="flex items-center gap-2">
                        <input type="checkbox" checked={layers.spaceports} onChange={() => toggleLayer('spaceports')} className="accent-[#10b981]" />
                        <span>SPACEPORTS</span>
                      </span>
                      <Info className="w-3 h-3 text-gray-500" />
                    </label>

                    <label className="flex items-center justify-between p-1.5 rounded hover:bg-[#121826] cursor-pointer">
                      <span className="flex items-center gap-2">
                        <input type="checkbox" checked={layers.underseaCables} onChange={() => toggleLayer('underseaCables')} className="accent-[#10b981]" />
                        <span>UNDERSEA CABLES</span>
                      </span>
                      <Info className="w-3 h-3 text-gray-500" />
                    </label>
                  </div>

                  <div className="mt-auto pt-2 border-t border-[#1b2234] text-[10px] text-gray-500">
                    <span>@ Elie Habib . Someone™</span>
                  </div>
                </div>

                {/* Center GIS Map Canvas */}
                <div className="flex-1 relative bg-[#06080e]">
                  <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" />

                  {/* Legend Overlay Bar at bottom of map (Screenshot 1) */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#090d16]/90 border border-[#1b2234] px-3 py-1.5 rounded-md text-[10px] text-gray-300 z-10 flex items-center gap-3 shadow-lg">
                    <span className="font-bold text-gray-400">LEGEND</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"/> High Alert</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"/> Elevated</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400"/> Monitoring</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-700"/> Conflict Zone</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"/> Base</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"/> Nuclear</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row Panels (Screenshot 1: LIVE NEWS, LIVE WEBCAMS, AI INSIGHTS) */}
              <div className="h-64 bg-[#080b12] grid grid-cols-1 md:grid-cols-3 gap-2 p-2 overflow-y-auto">
                
                {/* Panel 1: LIVE NEWS */}
                <div className="bg-[#0b0f19] border border-[#1b2234] rounded p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] font-bold border-b border-[#1b2234] pb-1.5">
                    <span className="flex items-center gap-1.5 text-white">
                      <span>LIVE NEWS</span>
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-gray-400">93</span>
                    </span>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Volume2 className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
                      <Maximize2 className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
                    </div>
                  </div>

                  {/* Channel Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto my-1.5 text-[9px] font-bold">
                    {['BLOOMBERG', 'SKYNEWS', 'EURONEWS', 'DW', 'CNBC', 'CNN', 'FRANCE 24', 'ALJAZEERA'].map(ch => (
                      <button
                        key={ch}
                        onClick={() => setSelectedNewsChannel(ch)}
                        className={`px-1.5 py-0.5 rounded whitespace-nowrap ${
                          selectedNewsChannel === ch ? 'bg-red-600 text-white' : 'bg-[#121826] text-gray-400'
                        }`}
                      >
                        {ch}
                      </button>
                    ))}
                  </div>

                  {/* Video Box Placeholder / Live Broadcast display */}
                  <div className="flex-1 bg-black rounded border border-[#1e273a] relative flex items-center justify-center p-3 text-center">
                    <div>
                      <div className="text-[#10b981] font-bold text-xs mb-1">
                        SATELLITE STREAM: {selectedNewsChannel}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        BRENT CRUDE INTRADAY $87.29 ▲ 0.49% | FUTURES RISE ON US-IRAN OPTIMISM
                      </div>
                      <button
                        onClick={() => {
                          soundFx.playSuccess();
                          onConsultBarlinGptWorld(`Barlin GPT, analyze the current live news broadcast from ${selectedNewsChannel}.`);
                          onClose();
                        }}
                        className="mt-2 px-2.5 py-1 bg-[#10b981]/20 border border-[#10b981] text-[#10b981] text-[10px] font-bold rounded"
                      >
                        CONSULT BARLIN GPT NEWS BRIEF
                      </button>
                    </div>
                  </div>
                </div>

                {/* Panel 2: LIVE WEBCAMS */}
                <div className="bg-[#0b0f19] border border-[#1b2234] rounded p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] font-bold border-b border-[#1b2234] pb-1.5">
                    <span className="flex items-center gap-1.5 text-white">
                      <span>LIVE WEBCAMS</span>
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-gray-400">23</span>
                    </span>
                    <Maximize2 className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-white" />
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto my-1.5 text-[9px] font-bold">
                    {['ALL', 'MIDEAST', 'EUROPE', 'AMERICAS', 'ASIA', 'SPACE'].map((f, idx) => (
                      <span key={f} className={`px-2 py-0.5 rounded ${idx === 0 ? 'bg-red-600 text-white' : 'bg-[#121826] text-gray-400'}`}>
                        {f}
                      </span>
                    ))}
                  </div>

                  {/* Webcams Grid */}
                  <div className="flex-1 grid grid-cols-2 gap-1.5 bg-black p-1.5 rounded border border-[#1e273a]">
                    <div className="bg-[#121826] rounded p-1 flex flex-col justify-between relative overflow-hidden">
                      <span className="text-[9px] font-bold text-gray-300">Strait of Hormuz Cam 01</span>
                      <span className="text-[8px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"/> ONLINE</span>
                    </div>
                    <div className="bg-[#121826] rounded p-1 flex flex-col justify-between relative overflow-hidden">
                      <span className="text-[9px] font-bold text-gray-300">Red Sea Shipping Corridor</span>
                      <span className="text-[8px] text-emerald-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"/> ONLINE</span>
                    </div>
                  </div>
                </div>

                {/* Panel 3: AI INSIGHTS */}
                <div className="bg-[#0b0f19] border border-[#1b2234] rounded p-2.5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] font-bold border-b border-[#1b2234] pb-1.5">
                    <span className="flex items-center gap-1.5 text-[#10b981]">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      <span>BARLIN GPT AI INSIGHTS</span>
                      <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[9px] rounded">LIVE</span>
                    </span>
                    <Settings className="w-3.5 h-3.5 text-gray-400 cursor-pointer" />
                  </div>

                  <div className="my-2 p-2 bg-[#121826] rounded border border-[#1e273a] text-xs space-y-1">
                    <div className="font-bold text-gray-200 text-[11px] flex items-center gap-1">
                      <span>WORLD BRIEF</span>
                    </div>
                    <p className="text-[11px] text-gray-300 leading-relaxed">
                      "Syria sentences Assad to death <span className="text-[#10b981]">[1][3][5]</span>, US and Iran trade demands <span className="text-[#10b981]">[4]</span>, and oil prices rise <span className="text-[#10b981]">[6][8]</span>."
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      soundFx.playSuccess();
                      onConsultBarlinGptWorld("Barlin GPT, expand on the latest geopolitical brief regarding Syria, US-Iran trade, and crude oil markets.");
                      onClose();
                    }}
                    className="w-full py-1.5 bg-[#10b981]/20 hover:bg-[#10b981]/30 border border-[#10b981] text-[#10b981] text-xs font-bold rounded transition"
                  >
                    ASK BARLIN GPT FOR FULL BRIEFING
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ================= VIEW 2: COMMODITY & GEOPOLITICAL DASHBOARD VIEW ================= */}
          {activeMainTab === 'Commodity' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#05070a]">
              
              {/* ROW 1: GCC INVESTMENTS | SANCTIONS | MACRO METRICS | CONSUMER PRICES */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* GCC Investments */}
                <div className="bg-[#090d16] border border-[#1b2234] rounded p-3">
                  <div className="text-xs font-bold text-gray-300 mb-2 flex items-center justify-between">
                    <span>GCC INVESTMENTS</span>
                    <span className="text-[10px] text-gray-500">42</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Search assets, countries, entities..."
                    className="w-full p-1.5 text-xs bg-[#121826] border border-[#1e283d] rounded text-gray-200 mb-2 focus:outline-none"
                  />
                  <div className="space-y-2 text-xs">
                    <div className="p-1.5 bg-[#121826] rounded border border-[#1e273a]">
                      <div className="font-bold text-gray-200">AE Al-Sokhna Port Terminal</div>
                      <div className="text-[10px] text-gray-400">Egypt • Ports • operational • $660M</div>
                    </div>
                    <div className="p-1.5 bg-[#121826] rounded border border-[#1e273a]">
                      <div className="font-bold text-gray-200">SA Alat (Advanced Electronics)</div>
                      <div className="text-[10px] text-gray-400">Saudi Arabia • Manufacturing • $100B</div>
                    </div>
                  </div>
                </div>

                {/* Sanctions & Designations */}
                <div className="bg-[#090d16] border border-[#1b2234] rounded p-3 text-xs">
                  <div className="font-bold text-gray-300 mb-2">SANCTIONS & DESIGNATIONS</div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-1.5 bg-[#121826] rounded">
                      <span>Russia (RU)</span>
                      <span className="font-bold text-red-400">5,939 designations</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 bg-[#121826] rounded">
                      <span>Unknown (XX)</span>
                      <span className="font-bold text-orange-400">3,402 designations</span>
                    </div>
                    <div className="flex items-center justify-between p-1.5 bg-[#121826] rounded">
                      <span>Iran (IR)</span>
                      <span className="font-bold text-red-400">1,621 designations</span>
                    </div>
                  </div>
                </div>

                {/* Macro Volatility */}
                <div className="bg-[#090d16] border border-[#1b2234] rounded p-3 text-xs">
                  <div className="font-bold text-gray-300 mb-2">MACRO INDICATORS</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 bg-[#121826] rounded">
                      <div className="text-[10px] text-gray-400">VIX INDEX</div>
                      <div className="text-base font-bold text-white">14.9</div>
                      <div className="text-[10px] text-red-400">-0.25</div>
                    </div>
                    <div className="p-2 bg-[#121826] rounded">
                      <div className="text-[10px] text-gray-400">FED FUNDS RATE</div>
                      <div className="text-base font-bold text-yellow-400">3.63%</div>
                      <div className="text-[10px] text-gray-400">0%</div>
                    </div>
                    <div className="p-2 bg-[#121826] rounded">
                      <div className="text-[10px] text-gray-400">10Y-2Y SPREAD</div>
                      <div className="text-base font-bold text-emerald-400">+0.19</div>
                    </div>
                    <div className="p-2 bg-[#121826] rounded">
                      <div className="text-[10px] text-gray-400">UNEMPLOYMENT</div>
                      <div className="text-base font-bold text-white">4.1%</div>
                    </div>
                  </div>
                </div>

                {/* Consumer Prices */}
                <div className="bg-[#090d16] border border-[#1b2234] rounded p-3 text-xs">
                  <div className="font-bold text-gray-300 mb-2 flex items-center justify-between">
                    <span>CONSUMER PRICES</span>
                    <span className="text-[10px] text-[#10b981]">ALL</span>
                  </div>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between p-1 bg-[#121826] rounded">
                      <span>AE UAE</span>
                      <span className="text-[#10b981]">100.0</span>
                      <span className="text-gray-400">16m ago</span>
                    </div>
                    <div className="flex justify-between p-1 bg-[#121826] rounded">
                      <span>AU Australia</span>
                      <span className="text-[#10b981]">100.0</span>
                      <span className="text-gray-400">14m ago</span>
                    </div>
                    <div className="flex justify-between p-1 bg-[#121826] rounded">
                      <span>IN India</span>
                      <span className="text-[#10b981]">100.0</span>
                      <span className="text-gray-400">20m ago</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ROW 2: AIRLINE INTELLIGENCE | PREDICTIONS | WORLD CLOCK | MY MONITORS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* Airline Intelligence */}
                <div className="bg-[#090d16] border border-[#1b2234] rounded p-3 text-xs">
                  <div className="font-bold text-gray-300 mb-2 flex items-center justify-between">
                    <span>AIRLINE INTELLIGENCE</span>
                    <Plane className="w-3.5 h-3.5 text-[#10b981]" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between p-1.5 bg-[#121826] rounded">
                      <span>LHR London Heathrow</span>
                      <span className="text-emerald-400 font-bold">NORMAL</span>
                    </div>
                    <div className="flex justify-between p-1.5 bg-[#121826] rounded">
                      <span>CDG Paris Charles de Gaulle</span>
                      <span className="text-emerald-400 font-bold">NORMAL</span>
                    </div>
                    <div className="flex justify-between p-1.5 bg-[#121826] rounded">
                      <span>FRA Frankfurt Airport</span>
                      <span className="text-yellow-400 font-bold">MODERATE (+32m)</span>
                    </div>
                    <div className="flex justify-between p-1.5 bg-[#121826] rounded">
                      <span>IST Istanbul Airport</span>
                      <span className="text-emerald-400 font-bold">NORMAL</span>
                    </div>
                  </div>
                </div>

                {/* Polymarket Predictions */}
                <div className="bg-[#090d16] border border-[#1b2234] rounded p-3 text-xs">
                  <div className="font-bold text-gray-300 mb-2 flex items-center justify-between">
                    <span>PREDICTIONS</span>
                    <span className="px-1.5 py-0.5 bg-purple-900/50 text-purple-300 text-[9px] rounded font-bold">POLYMARKET</span>
                  </div>
                  <p className="text-[11px] text-gray-200 font-semibold mb-2">
                    Israel and Indonesia normalize relations by December 31, 2026?
                  </p>
                  <div className="text-[10px] text-gray-400 mb-2 flex justify-between">
                    <span>Vol: $3.5M</span>
                    <span className="text-red-400 font-bold">LEAN NO</span>
                  </div>
                  <div className="w-full bg-[#121826] h-4 rounded overflow-hidden flex font-bold text-[9px]">
                    <div className="bg-emerald-500 text-black flex items-center justify-center" style={{ width: '11%' }}>11%</div>
                    <div className="bg-red-500 text-white flex items-center justify-center" style={{ width: '89%' }}>89%</div>
                  </div>
                </div>

                {/* World Clock */}
                <div className="bg-[#090d16] border border-[#1b2234] rounded p-3 text-xs">
                  <div className="font-bold text-gray-300 mb-2 flex items-center justify-between">
                    <span>WORLD CLOCK</span>
                    <Clock className="w-3.5 h-3.5 text-[#10b981]" />
                  </div>
                  <div className="space-y-2">
                    <div className="p-1.5 bg-[#121826] rounded flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">Mumbai</div>
                        <div className="text-[9px] text-gray-400">NSE • CLOSED</div>
                      </div>
                      <div className="font-bold text-[#10b981] text-sm">16:36:45</div>
                    </div>
                    <div className="p-1.5 bg-[#121826] rounded flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">New York</div>
                        <div className="text-[9px] text-gray-400">NYSE • CLOSED</div>
                      </div>
                      <div className="font-bold text-[#10b981] text-sm">07:06:45</div>
                    </div>
                    <div className="p-1.5 bg-[#121826] rounded flex justify-between items-center">
                      <div>
                        <div className="font-bold text-white">London</div>
                        <div className="text-[9px] text-gray-400">LSE • OPEN</div>
                      </div>
                      <div className="font-bold text-[#10b981] text-sm">12:06:45</div>
                    </div>
                  </div>
                </div>

                {/* My Monitors */}
                <div className="bg-[#090d16] border border-[#1b2234] rounded p-3 text-xs flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-gray-300 mb-2">MY MONITORS</div>
                    <form onSubmit={handleAddMonitor} className="flex gap-1 mb-2">
                      <input
                        type="text"
                        placeholder="Keywords (comma separated)"
                        value={myMonitorInput}
                        onChange={e => setMyMonitorInput(e.target.value)}
                        className="flex-1 p-1 text-xs bg-[#121826] border border-[#1e283d] rounded text-gray-200 focus:outline-none"
                      />
                    </form>
                    <div className="flex flex-wrap gap-1">
                      {userMonitors.map((m, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-[#10b981]/20 border border-[#10b981] text-[#10b981] text-[10px] rounded">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={handleAddMonitor}
                    className="w-full py-1 bg-[#10b981] text-black font-bold rounded text-xs mt-2 hover:bg-[#10b981]/80"
                  >
                    + ADD MONITOR
                  </button>
                </div>

              </div>

              {/* ROW 3: MARKETS | METALS | ENERGY COMPLEX | STRAIT OF HORMUZ */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* Markets */}
                <div className="bg-[#090d16] border border-[#1b2234] rounded p-3 text-xs">
                  <div className="font-bold text-gray-300 mb-2">GLOBAL MARKETS</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-1.5 bg-[#121826] rounded">
                      <span className="text-gray-300">BSE Sensex</span>
                      <span className="font-bold text-red-400">78,154 <span className="text-[10px]">(-0.49%)</span></span>
                    </div>
                    <div className="flex justify-between items-center p-1.5 bg-[#121826] rounded">
                      <span className="text-gray-300">Dow Jones</span>
                      <span className="font-bold text-red-400">53,976 <span className="text-[10px]">(-0.11%)</span></span>
                    </div>
                    <div className="flex justify-between items-center p-1.5 bg-[#121826] rounded">
                      <span className="text-gray-300">S&P 500</span>
                      <span className="font-bold text-[#10b981]">7,753 <span className="text-[10px]">(+0.06%)</span></span>
                    </div>
                  </div>
                </div>

                {/* Metals & Materials */}
                <div className="bg-[#090d16] border border-[#1b2234] rounded p-3 text-xs">
                  <div className="font-bold text-gray-300 mb-2">METALS & MATERIALS</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-1.5 bg-[#121826] rounded">
                      <span className="text-gray-300">Gold (GC)</span>
                      <span className="font-bold text-[#10b981]">$4,438.30 <span className="text-[10px]">(+0.42%)</span></span>
                    </div>
                    <div className="flex justify-between items-center p-1.5 bg-[#121826] rounded">
                      <span className="text-gray-300">Silver (SI)</span>
                      <span className="font-bold text-red-400">$65.22 <span className="text-[10px]">(-0.09%)</span></span>
                    </div>
                    <div className="flex justify-between items-center p-1.5 bg-[#121826] rounded">
                      <span className="text-gray-300">Copper</span>
                      <span className="font-bold text-[#10b981]">$6.68 <span className="text-[10px]">(+0.89%)</span></span>
                    </div>
                  </div>
                </div>

                {/* Energy Complex */}
                <div className="bg-[#090d16] border border-[#1b2234] rounded p-3 text-xs">
                  <div className="font-bold text-gray-300 mb-2">ENERGY COMPLEX</div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-1.5 bg-[#121826] rounded">
                      <span className="text-gray-300">Brent Crude</span>
                      <span className="font-bold text-[#10b981]">$89.01 <span className="text-[10px]">(+1.47%)</span></span>
                    </div>
                    <div className="flex justify-between items-center p-1.5 bg-[#121826] rounded">
                      <span className="text-gray-300">WTI Crude</span>
                      <span className="font-bold text-[#10b981]">$83.55 <span className="text-[10px]">(+1.73%)</span></span>
                    </div>
                    <div className="flex justify-between items-center p-1.5 bg-[#121826] rounded">
                      <span className="text-gray-300">NatGas</span>
                      <span className="font-bold text-red-400">$2.75 <span className="text-[10px]">(-1.50%)</span></span>
                    </div>
                  </div>
                </div>

                {/* Strait of Hormuz Crisis Card (Exact from Screenshot 3) */}
                <div className="bg-[#090d16] border border-red-500/50 rounded p-3 text-xs">
                  <div className="font-bold text-red-400 mb-1 flex items-center justify-between">
                    <span>Strait of Hormuz</span>
                    <span className="px-1.5 py-0.5 bg-red-600 text-white text-[9px] rounded font-extrabold">80/100 RED</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mb-2">0 warning(s) • 0 AIS disruption(s)</div>
                  <div className="p-2 bg-red-950/40 border border-red-500/30 rounded text-[10px] space-y-1 text-red-200">
                    <div className="font-bold text-red-400">WAR ZONE // ACTIVE CONFLICT</div>
                    <div>~6.3 mb/d (30% of 21 baseline)</div>
                    <div>Iranian naval blockade risk and mines reported in Persian Gulf.</div>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* 5. FOOTER LINK BAR (Matching bottom bar in screenshots) */}
        <div className="w-full bg-[#080b12] border-t border-[#1b2234] px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-gray-400 gap-2">
          <div className="font-bold text-gray-300 flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-[#10b981]" />
            <span>WORLD MONITOR <span className="text-[10px] text-gray-500">v2.10.0 . @ELIEHABIB</span></span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[10px]">
            <span className="hover:text-white cursor-pointer">Countries</span>
            <span className="hover:text-white cursor-pointer">Chokepoints</span>
            <span className="hover:text-white cursor-pointer">Crises</span>
            <span className="hover:text-white cursor-pointer">Tools</span>
            <span className="hover:text-white cursor-pointer">Pricing</span>
            <span className="hover:text-white cursor-pointer font-bold text-[#10b981]">GitHub</span>
            <span className="hover:text-white cursor-pointer">Discord</span>
            <span className="hover:text-white cursor-pointer">Download App</span>
          </div>
        </div>

      </div>
    </div>
  );
};
