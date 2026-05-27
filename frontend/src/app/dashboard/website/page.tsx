'use client';

import { API_BASE_URL } from '@/lib/api';

import React, { useState, useEffect } from 'react';
import { 
  Globe, Plus, Edit, Trash2, Eye, Layout, Settings, FileText, Check, 
  AlertCircle, Save, ExternalLink, ArrowUp, ArrowDown, Sparkles, Image, 
  Type, Palette, Monitor, Tablet, Phone, Layers, RefreshCw, Scissors,
  Sliders, Grid, ChevronUp, ChevronDown, X
} from 'lucide-react';

import HeroSection from '@/components/website/HeroSection';
import FeaturesSection from '@/components/website/FeaturesSection';
import TestimonialsSection from '@/components/website/TestimonialsSection';
import RoomsSection from '@/components/website/RoomsSection';
import ServicesSection from '@/components/website/ServicesSection';

export default function OrgWebsitePage() {
  const [websites, setWebsites] = useState<any[]>([]);
  const [selectedWebsite, setSelectedWebsite] = useState<any>(null);
  const [brands, setBrands] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'settings' | 'pages' | 'sections' | 'preview'>('preview');
  
  // Selection states
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  
  // Modals & UI toggles
  const [isCreatingSite, setIsCreatingSite] = useState(false);
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  
  // Form buffers
  const [newSiteData, setNewSiteData] = useState({ title: '', subdomain: '', description: '', brandId: '' });
  const [newPageData, setNewPageData] = useState({ title: '', slug: '', isHome: false, seoTitle: '', seoDescription: '' });
  const [newSectionType, setNewSectionType] = useState<'HERO' | 'FEATURES' | 'ROOMS' | 'TESTIMONIALS' | 'PARLOR_SERVICES'>('HERO');
  
  // Dynamic Data States
  const [parlorServicesData, setParlorServicesData] = useState<any[]>([]);
  const [activeServiceEditId, setActiveServiceEditId] = useState<string | null>(null);
  const [savingServiceId, setSavingServiceId] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : '';
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {};
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-tenant-id': user.organization?.id || ''
    };
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch Brands
      const resBrands = await fetch(`${API_BASE_URL}/api/v1/websites/brands`, { headers: getHeaders() });
      if (resBrands.ok) {
        const dataBrands = await resBrands.json();
        setBrands(dataBrands);
      }

      // Fetch Websites
      const resSites = await fetch(`${API_BASE_URL}/api/v1/websites`, { headers: getHeaders() });
      if (resSites.ok) {
        const dataSites = await resSites.json();
        setWebsites(dataSites);
        if (dataSites.length > 0) {
          const site = dataSites[0];
          setSelectedWebsite(site);
          if (site.pages && site.pages.length > 0) {
            setSelectedPage(site.pages.find((p: any) => p.isHome) || site.pages[0]);
          }
        }
      }
      // Fetch Parlor Services if enabled
      try {
        const resAdminParlor = await fetch(`${API_BASE_URL}/api/v1/parlor/services`, { headers: getHeaders() });
        if (resAdminParlor.ok) {
          const dataParlor = await resAdminParlor.json();
          setParlorServicesData(dataParlor);
        }
      } catch(e) { console.log('Parlor module might not be enabled'); }
    } catch (err) {
      showToast('Failed to load website builder data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Handlers ---

  const handleCreateSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteData.title || !newSiteData.subdomain) {
      showToast('Please provide a website title and subdomain', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/websites`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newSiteData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create website');
      }

      const createdSite = await res.json();
      setWebsites([...websites, createdSite]);
      setSelectedWebsite(createdSite);
      if (createdSite.pages && createdSite.pages.length > 0) {
        setSelectedPage(createdSite.pages.find((p: any) => p.isHome) || createdSite.pages[0]);
      }
      setIsCreatingSite(false);
      setNewSiteData({ title: '', subdomain: '', description: '', brandId: '' });
      showToast('Website successfully created with starter CMS content!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error creating website', 'error');
    }
  };

  const handleUpdateSettings = async (updatedConfig?: any, newStatus?: string) => {
    if (!selectedWebsite) return;
    const payload = {
      title: selectedWebsite.title,
      description: selectedWebsite.description,
      subdomain: selectedWebsite.subdomain,
      customDomain: selectedWebsite.customDomain,
      status: newStatus || selectedWebsite.status,
      config: updatedConfig || selectedWebsite.config,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/websites/${selectedWebsite.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = await res.json();
        setSelectedWebsite({ ...selectedWebsite, ...payload });
        showToast('Website settings updated successfully!', 'success');
      } else {
        throw new Error('Failed to update website');
      }
    } catch (err) {
      showToast('Error saving settings', 'error');
    }
  };

  const handleAddPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWebsite || !newPageData.title || !newPageData.slug) {
      showToast('Please provide page title and slug', 'error');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/websites/${selectedWebsite.id}/pages`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newPageData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create page');
      }

      const newPage = await res.json();
      const updatedPages = [...(selectedWebsite.pages || []), newPage];
      const updatedSite = { ...selectedWebsite, pages: updatedPages };
      setSelectedWebsite(updatedSite);
      setSelectedPage(newPage);
      setIsAddingPage(false);
      setNewPageData({ title: '', slug: '', isHome: false, seoTitle: '', seoDescription: '' });
      showToast('New page added successfully!', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/websites/pages/${pageId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (res.ok) {
        const updatedPages = selectedWebsite.pages.filter((p: any) => p.id !== pageId);
        setSelectedWebsite({ ...selectedWebsite, pages: updatedPages });
        if (selectedPage?.id === pageId) {
          setSelectedPage(updatedPages[0] || null);
        }
        showToast('Page deleted successfully!', 'success');
      } else {
        const err = await res.json();
        throw new Error(err.message);
      }
    } catch (err: any) {
      showToast(err.message || 'Error deleting page', 'error');
    }
  };

  const handleAddSection = async (type?: string) => {
    if (!selectedPage) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/websites/pages/${selectedPage.id}/sections`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ type: type || newSectionType }),
      });

      if (res.ok) {
        const newSec = await res.json();
        const updatedSections = [...(selectedPage.sections || []), newSec];
        const updatedPage = { ...selectedPage, sections: updatedSections };
        setSelectedPage(updatedPage);
        const updatedPages = selectedWebsite.pages.map((p: any) => p.id === updatedPage.id ? updatedPage : p);
        setSelectedWebsite({ ...selectedWebsite, pages: updatedPages });
        setIsAddingSection(false);
        showToast('Section added to page!', 'success');
      }
    } catch (err) {
      showToast('Error adding section', 'error');
    }
  };

  const handleUpdateSectionContent = async (secId: string, updatedContent: any) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/websites/sections/${secId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ content: updatedContent }),
      });

      if (res.ok) {
        const updatedSec = await res.json();
        const updatedSections = selectedPage.sections.map((s: any) => s.id === secId ? { ...s, content: updatedContent } : s);
        const updatedPage = { ...selectedPage, sections: updatedSections };
        setSelectedPage(updatedPage);
        const updatedPages = selectedWebsite.pages.map((p: any) => p.id === updatedPage.id ? updatedPage : p);
        setSelectedWebsite({ ...selectedWebsite, pages: updatedPages });
        setEditingSection(null);
        showToast('Section content updated!', 'success');
      }
    } catch (err) {
      showToast('Error updating section', 'error');
    }
  };

  const handleDeleteSection = async (secId: string) => {
    if (!confirm('Remove this section from the page?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/websites/sections/${secId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (res.ok) {
        const updatedSections = selectedPage.sections.filter((s: any) => s.id !== secId);
        const updatedPage = { ...selectedPage, sections: updatedSections };
        setSelectedPage(updatedPage);
        const updatedPages = selectedWebsite.pages.map((p: any) => p.id === updatedPage.id ? updatedPage : p);
        setSelectedWebsite({ ...selectedWebsite, pages: updatedPages });
        setEditingSection(null);
        showToast('Section removed', 'success');
      }
    } catch (err) {
      showToast('Error removing section', 'error');
    }
  };

  const handleReorderSection = async (index: number, direction: 'up' | 'down') => {
    const sections = [...selectedPage.sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    // Swap
    const temp = sections[index];
    sections[index] = sections[targetIndex];
    sections[targetIndex] = temp;

    // Update orders
    const updatedSections = sections.map((sec: any, idx: number) => ({ ...sec, order: idx + 1 }));
    const updatedPage = { ...selectedPage, sections: updatedSections };
    setSelectedPage(updatedPage);

    // Backend save
    try {
      await Promise.all(updatedSections.map((s: any) => 
        fetch(`${API_BASE_URL}/api/v1/websites/sections/${s.id}`, {
          method: 'PUT',
          headers: getHeaders(),
          body: JSON.stringify({ order: s.order }),
        })
      ));
      showToast('Section order updated', 'success');
    } catch (err) {}
  };

  // Real-time inspector input cascading
  const updateContentField = (key: string, val: any) => {
    if (!editingSection) return;
    const updatedContent = { ...editingSection.content, [key]: val };
    setEditingSection({ ...editingSection, content: updatedContent });
    
    // Cascade to active simulated canvas instantly
    const updatedSections = selectedPage.sections.map((s: any) => 
      s.id === editingSection.id ? { ...s, content: updatedContent } : s
    );
    setSelectedPage({ ...selectedPage, sections: updatedSections });
  };

  const updateItemField = (idx: number, key: string, val: any) => {
    if (!editingSection) return;
    const updatedItems = [...(editingSection.content.items || [])];
    updatedItems[idx] = { ...updatedItems[idx], [key]: val };
    const updatedContent = { ...editingSection.content, items: updatedItems };
    setEditingSection({ ...editingSection, content: updatedContent });
    
    // Cascade to active simulated canvas instantly
    const updatedSections = selectedPage.sections.map((s: any) => 
      s.id === editingSection.id ? { ...s, content: updatedContent } : s
    );
    setSelectedPage({ ...selectedPage, sections: updatedSections });
  };

  const updateParlorServiceField = (serviceId: string, field: string, value: any) => {
    setParlorServicesData(prev => 
      prev.map(s => s.id === serviceId ? { ...s, [field]: value } : s)
    );
  };

  const handleSaveParlorService = async (serviceId: string) => {
    const serviceToSave = parlorServicesData.find(s => s.id === serviceId);
    if (!serviceToSave) return;
    
    setSavingServiceId(serviceId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/parlor/services/${serviceId}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          name: serviceToSave.name,
          price: Number(serviceToSave.price),
          duration: Number(serviceToSave.duration),
          description: serviceToSave.description,
          image: serviceToSave.image || null
        })
      });
      
      if (res.ok) {
        showToast('Service card updated successfully!', 'success');
      } else {
        throw new Error('Failed to update service card');
      }
    } catch (err) {
      showToast('Failed to save service card modifications', 'error');
    } finally {
      setSavingServiceId(null);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw className="spinner" size={36} style={{ animation: 'spin 1s linear infinite', marginBottom: 'var(--space-3)' }} />
          <p>Loading Website Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', paddingBottom: 'var(--space-10)' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000,
          background: toast.type === 'success' ? '#22c55e' : '#ef4444',
          color: 'white', padding: '12px 24px', borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
          display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600
        }}>
          {toast.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          {toast.message}
        </div>
      )}

      {/* Header Bar */}
      <div className="card glass" style={{ padding: 'var(--space-5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ background: 'rgba(166, 118, 83, 0.15)', padding: '12px', borderRadius: '12px' }}>
            <Globe size={28} style={{ color: 'var(--primary)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              Website Builder & CMS Studio
              {selectedWebsite && (
                <span style={{ 
                  fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', 
                  background: selectedWebsite.status === 'PUBLISHED' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                  color: selectedWebsite.status === 'PUBLISHED' ? '#22c55e' : '#eab308' 
                }}>
                  ● {selectedWebsite.status}
                </span>
              )}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              {selectedWebsite ? `Managing domain: ${selectedWebsite.customDomain || `${selectedWebsite.subdomain}.kswtechzone.com.np`}` : 'Create your public booking presence'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {selectedWebsite ? (
            <>
              <button 
                onClick={() => handleUpdateSettings(undefined, selectedWebsite.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED')}
                className="btn" 
                style={{ 
                  background: selectedWebsite.status === 'PUBLISHED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                  color: selectedWebsite.status === 'PUBLISHED' ? '#ef4444' : '#22c55e',
                  border: `1px solid ${selectedWebsite.status === 'PUBLISHED' ? '#ef4444' : '#22c55e'}`
                }}
              >
                {selectedWebsite.status === 'PUBLISHED' ? 'Unpublish Site' : 'Publish Live'}
              </button>
              
              <a 
                href={`https://${selectedWebsite.customDomain || `${selectedWebsite.subdomain}.kswtechzone.com.np`}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ExternalLink size={18} />
                Visit Website
              </a>
            </>
          ) : (
            <button onClick={() => setIsCreatingSite(true)} className="btn btn-primary" style={{ gap: '8px' }}>
              <Plus size={20} />
              Create Website
            </button>
          )}
        </div>
      </div>

      {/* Main Content Studio Workspace */}
      {selectedWebsite ? (
        <div style={{ display: 'flex', gap: '24px', alignItems: 'stretch' }}>
          
          {/* ================= PANEL 1: LEFT SIDEBAR (Library, Pages & Settings) ================= */}
          <div className="card glass" style={{ width: '330px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
            
            {/* Pages Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={16} /> Pages & Navigation
                </h3>
                <button 
                  onClick={() => setIsAddingPage(true)} 
                  style={{ background: 'rgba(166, 118, 83, 0.1)', border: 'none', borderRadius: '4px', padding: '4px 8px', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700 }}
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(selectedWebsite.pages || []).map((page: any) => (
                  <div 
                    key={page.id}
                    onClick={() => { setSelectedPage(page); setEditingSection(null); }}
                    style={{
                      background: selectedPage?.id === page.id ? 'rgba(166, 118, 83, 0.15)' : 'var(--bg-main)',
                      border: `1px solid ${selectedPage?.id === page.id ? 'var(--primary)' : 'var(--border)'}`,
                      borderRadius: '8px', padding: '10px 14px', cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: selectedPage?.id === page.id ? 'white' : 'var(--text-main)' }}>
                        {page.title}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        /{page.slug} {page.isHome && '★'}
                      </span>
                    </div>
                    {!page.isHome && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeletePage(page.id); }}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Drag & Add Component Library */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={16} /> Component Library
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '16px' }}>
                Drag a layout block into the canvas or click to add it to the active page.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { type: 'HERO', label: 'Hero Banner', icon: <Image size={18} />, desc: 'Headline, background image & CTA link' },
                  { type: 'FEATURES', label: 'Amenities Cards', icon: <Sparkles size={18} />, desc: 'Grid block of features & descriptions' },
                  { type: 'ROOMS', label: 'Rooms Showcase', icon: <Grid size={18} />, desc: 'Live booking inventory display' },
                  { type: 'TESTIMONIALS', label: 'Guest Reviews', icon: <Type size={18} />, desc: 'Quotes slider or review blocks' },
                  { type: 'PARLOR_SERVICES', label: 'Dynamic Services', icon: <Scissors size={18} />, desc: 'Treatment menu with category tabs' },
                ].map((comp) => (
                  <div
                    key={comp.type}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', comp.type)}
                    onClick={() => handleAddSection(comp.type)}
                    style={{
                      background: 'var(--bg-main)', border: '1px dashed var(--border)',
                      borderRadius: '10px', padding: '12px', cursor: 'grab',
                      display: 'flex', gap: '12px', alignItems: 'center', transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <div style={{ background: 'rgba(166, 118, 83, 0.1)', color: 'var(--primary)', padding: '10px', borderRadius: '8px' }}>
                      {comp.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ display: 'block', fontWeight: 700, fontSize: '0.85rem' }}>{comp.label}</span>
                      <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{comp.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Customizer / Settings */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Palette size={16} /> Theme Settings
              </h3>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Brand Accent Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="color" 
                    value={selectedWebsite.config?.primaryColor || '#A67653'} 
                    onChange={(e) => setSelectedWebsite({ ...selectedWebsite, config: { ...selectedWebsite.config, primaryColor: e.target.value } })}
                    style={{ width: '32px', height: '32px', border: 'none', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                  />
                  <span style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{selectedWebsite.config?.primaryColor || '#A67653'}</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Header Theme Style</label>
                <select 
                  className="input input-dark"
                  style={{ fontSize: '0.85rem', padding: '8px' }}
                  value={selectedWebsite.config?.headerStyle || 'glass'}
                  onChange={(e) => setSelectedWebsite({ ...selectedWebsite, config: { ...selectedWebsite.config, headerStyle: e.target.value } })}
                >
                  <option value="glass">Glassmorphism (Modern)</option>
                  <option value="solid">Solid Slate Dark</option>
                  <option value="minimal">Minimal Transparent</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Site Title</label>
                <input 
                  type="text" 
                  className="input input-dark" 
                  style={{ fontSize: '0.85rem', padding: '8px' }}
                  value={selectedWebsite.title} 
                  onChange={(e) => setSelectedWebsite({ ...selectedWebsite, title: e.target.value })} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Subdomain Prefix</label>
                <input 
                  type="text" 
                  className="input input-dark" 
                  style={{ fontSize: '0.85rem', padding: '8px' }}
                  value={selectedWebsite.subdomain} 
                  onChange={(e) => setSelectedWebsite({ ...selectedWebsite, subdomain: e.target.value })} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Custom Domain</label>
                <input 
                  type="text" 
                  placeholder="e.g. platinumresort.com"
                  className="input input-dark" 
                  style={{ fontSize: '0.85rem', padding: '8px' }}
                  value={selectedWebsite.customDomain || ''} 
                  onChange={(e) => setSelectedWebsite({ ...selectedWebsite, customDomain: e.target.value })} 
                />
              </div>

              <button onClick={() => handleUpdateSettings()} className="btn btn-primary" style={{ gap: '6px', fontSize: '0.85rem', padding: '10px 14px' }}>
                <Save size={16} /> Save Settings
              </button>
            </div>

          </div>

          {/* ================= PANEL 2: MAIN PREVIEW CANVAS ================= */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#090d16', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
            
            {/* Control Viewport Bar */}
            <div style={{ background: 'var(--bg-card)', padding: '12px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }}></span>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }}></span>
                <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '12px' }}>
                  https://{selectedWebsite.customDomain || `${selectedWebsite.subdomain}.kswtechzone.com.np`}/{selectedPage?.slug === 'home' ? '' : selectedPage?.slug}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button onClick={() => setPreviewMode('desktop')} className="btn" style={{ padding: '6px 12px', background: previewMode === 'desktop' ? 'var(--primary)' : 'transparent', color: previewMode === 'desktop' ? 'white' : 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <Monitor size={16} style={{ marginRight: '6px' }} /> Desktop
                </button>
                <button onClick={() => setPreviewMode('tablet')} className="btn" style={{ padding: '6px 12px', background: previewMode === 'tablet' ? 'var(--primary)' : 'transparent', color: previewMode === 'tablet' ? 'white' : 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <Tablet size={16} style={{ marginRight: '6px' }} /> Tablet
                </button>
                <button onClick={() => setPreviewMode('mobile')} className="btn" style={{ padding: '6px 12px', background: previewMode === 'mobile' ? 'var(--primary)' : 'transparent', color: previewMode === 'mobile' ? 'white' : 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <Phone size={16} style={{ marginRight: '6px' }} /> Mobile
                </button>
                <button 
                  onClick={() => setIsFullscreenPreview(true)} 
                  className="btn" 
                  style={{ 
                    padding: '6px 12px', 
                    background: 'transparent', 
                    border: '1px solid var(--border)', 
                    color: 'var(--text-main)', 
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginLeft: '8px'
                  }}
                >
                  <Eye size={16} /> Fullscreen
                </button>
              </div>
            </div>

            {/* Viewport Frame with Drop Target capability */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const type = e.dataTransfer.getData('text/plain');
                if (type) handleAddSection(type);
              }}
              style={{ 
                flex: 1, padding: previewMode === 'desktop' ? '0' : '40px 0', 
                overflowY: 'auto', display: 'flex', justifyContent: 'center', transition: 'all 0.3s',
                maxHeight: 'calc(100vh - 280px)', background: '#0b111e'
              }}
            >
              <div style={{ 
                width: previewMode === 'desktop' ? '100%' : previewMode === 'tablet' ? '768px' : '375px',
                background: 'white', color: '#1e293b', minHeight: '600px', 
                borderRadius: previewMode === 'desktop' ? '0' : '20px', overflowX: 'hidden',
                boxShadow: previewMode === 'desktop' ? 'none' : '0 25px 50px -12px rgba(0,0,0,0.5)',
                transition: 'width 0.3s'
              }}>
                {/* Simulated Header */}
                <header style={{
                  padding: '24px 32px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: selectedWebsite.config?.headerStyle === 'solid' ? '#0f172a' : 'white',
                  color: selectedWebsite.config?.headerStyle === 'solid' ? 'white' : '#0f172a',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: selectedWebsite.config?.primaryColor || '#A67653' }}></div>
                    <span style={{ fontWeight: 800, letterSpacing: '1px' }}>{selectedWebsite.title.toUpperCase()}</span>
                  </div>
                  <nav style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
                    {(selectedWebsite.pages || []).map((p: any) => (
                      <span key={p.id} style={{ opacity: selectedPage?.id === p.id ? 1 : 0.6, borderBottom: selectedPage?.id === p.id ? `2px solid ${selectedWebsite.config?.primaryColor || '#A67653'}` : 'none', paddingBottom: '4px' }}>
                        {p.title}
                      </span>
                    ))}
                  </nav>
                </header>

                {/* Canvas Page Blocks */}
                {selectedPage && (selectedPage.sections || []).length === 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '400px', color: '#64748b', padding: '40px', textAlign: 'center', border: '3px dashed #cbd5e1', margin: '24px', borderRadius: '16px' }}>
                    <Layers size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#334155' }}>Drop Component Block Here</h3>
                    <p style={{ maxWidth: '320px', fontSize: '0.9rem' }}>Drag card templates from the left Sidebar Library onto this area, or just click them to instantly append layout sections!</p>
                  </div>
                ) : (
                  (selectedPage?.sections || []).map((sec: any, idx: number) => {
                    const isHovered = hoveredSectionId === sec.id || editingSection?.id === sec.id;
                    return (
                      <div
                        key={sec.id}
                        onMouseEnter={() => setHoveredSectionId(sec.id)}
                        onMouseLeave={() => setHoveredSectionId(null)}
                        onClick={(e) => { e.stopPropagation(); setEditingSection(sec); }}
                        style={{
                          position: 'relative',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          outline: isHovered ? `3px solid ${selectedWebsite.config?.primaryColor || '#A67653'}` : 'none',
                          outlineOffset: '-3px'
                        }}
                      >
                        {/* Hover Overlay Floating Action Menu */}
                        {isHovered && (
                          <div style={{
                            position: 'absolute', top: '10px', right: '10px', zIndex: 100,
                            display: 'flex', alignItems: 'center', gap: '6px',
                            background: '#0f172a', padding: '6px 10px', borderRadius: '50px',
                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)'
                          }}>
                            {/* Section Label Badge */}
                            <span style={{ 
                              color: 'white', fontSize: '0.65rem', fontWeight: 800, marginRight: '8px', 
                              padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)' 
                            }}>
                              {sec.type === 'PARLOR_SERVICES' ? 'DYNAMIC SERVICES' : sec.type}
                            </span>
                            
                            {/* Move Up */}
                            <button 
                              disabled={idx === 0}
                              onClick={(e) => { e.stopPropagation(); handleReorderSection(idx, 'up'); }}
                              style={{ background: 'transparent', border: 'none', color: idx === 0 ? '#475569' : '#94a3b8', cursor: idx === 0 ? 'not-allowed' : 'pointer', padding: '4px' }}
                            >
                              <ChevronUp size={16} />
                            </button>
                            
                            {/* Move Down */}
                            <button 
                              disabled={idx === selectedPage.sections.length - 1}
                              onClick={(e) => { e.stopPropagation(); handleReorderSection(idx, 'down'); }}
                              style={{ background: 'transparent', border: 'none', color: idx === selectedPage.sections.length - 1 ? '#475569' : '#94a3b8', cursor: idx === selectedPage.sections.length - 1 ? 'not-allowed' : 'pointer', padding: '4px' }}
                            >
                              <ChevronDown size={16} />
                            </button>

                            {/* Divider */}
                            <span style={{ width: '1px', height: '14px', background: '#334155' }}></span>

                            {/* Edit Inspector Trigger */}
                            <button 
                              onClick={(e) => { e.stopPropagation(); setEditingSection(sec); }}
                              style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '4px' }}
                            >
                              <Edit size={14} />
                            </button>

                            {/* Delete Button */}
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteSection(sec.id); }}
                              style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}

                        {/* Rendering Section Component */}
                        {sec.type === 'HERO' && <HeroSection content={sec.content} config={selectedWebsite.config} previewMode={previewMode} />}
                        {sec.type === 'FEATURES' && <FeaturesSection content={sec.content} config={selectedWebsite.config} previewMode={previewMode} />}
                        {sec.type === 'TESTIMONIALS' && <TestimonialsSection content={sec.content} config={selectedWebsite.config} previewMode={previewMode} />}
                        {sec.type === 'ROOMS' && <RoomsSection content={sec.content} config={selectedWebsite.config} previewMode={previewMode} />}
                        {sec.type === 'PARLOR_SERVICES' && <ServicesSection content={sec.content} config={selectedWebsite.config} previewMode={previewMode} parlorServicesData={parlorServicesData} tenantSlug={selectedWebsite.subdomain} />}
                      </div>
                    );
                  })
                )}

                {/* Simulated Footer */}
                <footer style={{ background: '#0f172a', color: 'white', padding: '48px 32px', textAlign: 'center', borderTop: '1px solid #1e293b' }}>
                  <p style={{ margin: '0 0 12px 0', fontWeight: 700 }}>© 2026 {selectedWebsite.title}. All rights reserved.</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Powered by KSWMS CMS Studio</p>
                </footer>
              </div>
            </div>

          </div>

          {/* ================= PANEL 3: RIGHT SIDEBAR (Real-time Inspector) ================= */}
          <div className="card glass" style={{ width: '340px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', maxHeight: 'calc(100vh - 220px)' }}>
            {editingSection ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(166, 118, 83, 0.15)', color: 'var(--primary)', fontWeight: 800 }}>
                      INSPECTOR ACTIVE
                    </span>
                    <button 
                      onClick={() => setEditingSection(null)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      Deselect
                    </button>
                  </div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                    {editingSection.type === 'PARLOR_SERVICES' ? 'Dynamic Services' : editingSection.type}
                  </h2>
                </div>

                {/* Flexible Layout Controls */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--primary)' }}>Layout Flexibility</h3>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px' }}>Spacing Padding</label>
                      <select 
                        className="input input-dark" 
                        style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                        value={editingSection.content?.padding || 'medium'}
                        onChange={(e) => updateContentField('padding', e.target.value)}
                      >
                        <option value="small">Compact Spacing</option>
                        <option value="medium">Standard Spacing</option>
                        <option value="large">Spacious Spacing</option>
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px' }}>Text Align</label>
                      <select 
                        className="input input-dark" 
                        style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                        value={editingSection.content?.textAlign || 'center'}
                        onChange={(e) => updateContentField('textAlign', e.target.value)}
                      >
                        <option value="left">Left Align</option>
                        <option value="center">Center Align</option>
                        <option value="right">Right Align</option>
                      </select>
                    </div>
                  </div>

                  {(editingSection.type === 'FEATURES' || editingSection.type === 'ROOMS' || editingSection.type === 'TESTIMONIALS' || editingSection.type === 'PARLOR_SERVICES') && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px' }}>Grid Columns Grid</label>
                      <select 
                        className="input input-dark" 
                        style={{ fontSize: '0.85rem', padding: '6px 10px' }}
                        value={editingSection.content?.columns || (editingSection.type === 'TESTIMONIALS' || editingSection.type === 'PARLOR_SERVICES' ? '2' : '3')}
                        onChange={(e) => updateContentField('columns', e.target.value)}
                      >
                        <option value="2">2 Columns Grid</option>
                        <option value="3">3 Columns Grid</option>
                        <option value="4">4 Columns Grid</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Section Content Titles */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--primary)' }}>Content & Copy</h3>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px' }}>Section Headline</label>
                    <input 
                      type="text" 
                      className="input input-dark" 
                      style={{ fontSize: '0.85rem', padding: '8px' }}
                      value={editingSection.content?.headline || editingSection.content?.title || ''}
                      onChange={(e) => updateContentField(editingSection.type === 'HERO' ? 'headline' : 'title', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px' }}>Subtitle Description</label>
                    <textarea 
                      rows={2}
                      className="input input-dark" 
                      style={{ fontSize: '0.85rem', padding: '8px' }}
                      value={editingSection.content?.subtitle || ''}
                      onChange={(e) => updateContentField('subtitle', e.target.value)}
                    />
                  </div>
                </div>

                {/* Custom Content fields based on Section Type */}
                {editingSection.type === 'HERO' && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--primary)' }}>Hero Banner Settings</h3>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px' }}>Cover Background Image URL</label>
                      <input 
                        type="text" 
                        className="input input-dark" 
                        style={{ fontSize: '0.85rem', padding: '8px' }}
                        value={editingSection.content?.bgImage || ''}
                        onChange={(e) => updateContentField('bgImage', e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px' }}>CTA Button Label</label>
                        <input 
                          type="text" 
                          className="input input-dark" 
                          style={{ fontSize: '0.85rem', padding: '8px' }}
                          value={editingSection.content?.ctaText || ''}
                          onChange={(e) => updateContentField('ctaText', e.target.value)}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '6px' }}>CTA Button Path</label>
                        <input 
                          type="text" 
                          className="input input-dark" 
                          style={{ fontSize: '0.85rem', padding: '8px' }}
                          value={editingSection.content?.ctaLink || ''}
                          onChange={(e) => updateContentField('ctaLink', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {(editingSection.type === 'FEATURES' || editingSection.type === 'TESTIMONIALS') && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--primary)' }}>
                      {editingSection.type === 'FEATURES' ? 'Features List' : 'Review Quotes List'}
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '200px', overflowY: 'auto' }}>
                      {(editingSection.content?.items || []).map((item: any, idx: number) => (
                        <div key={idx} style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                          <input 
                            type="text" 
                            className="input input-dark" 
                            style={{ marginBottom: '6px', fontSize: '0.8rem', padding: '6px' }}
                            value={item.title || item.author || ''}
                            placeholder={editingSection.type === 'FEATURES' ? 'Feature Card Title' : 'Review Guest Name'}
                            onChange={(e) => updateItemField(idx, editingSection.type === 'FEATURES' ? 'title' : 'author', e.target.value)}
                          />
                          <textarea 
                            rows={2} 
                            className="input input-dark" 
                            style={{ fontSize: '0.8rem', padding: '6px' }}
                            value={item.description || item.quote || ''}
                            placeholder={editingSection.type === 'FEATURES' ? 'Feature Short Description' : 'Guest Review Quote text'}
                            onChange={(e) => updateItemField(idx, editingSection.type === 'FEATURES' ? 'description' : 'quote', e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {editingSection.type === 'PARLOR_SERVICES' && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--primary)' }}>
                      Modify Treatments & Services
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
                      {parlorServicesData.map((svc: any) => {
                        const isExpanded = activeServiceEditId === svc.id;
                        return (
                          <div key={svc.id} style={{ background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
                            {/* Accordion Header */}
                            <div 
                              onClick={() => setActiveServiceEditId(isExpanded ? null : svc.id)}
                              style={{ padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {svc.image ? (
                                  <img src={svc.image} style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }} alt="" />
                                ) : (
                                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'white', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Scissors size={14} color="var(--primary)" />
                                  </div>
                                )}
                                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{svc.name}</span>
                              </div>
                              {isExpanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                            </div>

                            {/* Accordion Expanded Content */}
                            {isExpanded && (
                              <div style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '10px', background: 'white' }}>
                                <div>
                                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block' }}>Service Name</label>
                                  <input 
                                    type="text" 
                                    className="input input-dark" 
                                    style={{ fontSize: '0.8rem', padding: '6px' }}
                                    value={svc.name || ''}
                                    onChange={(e) => updateParlorServiceField(svc.id, 'name', e.target.value)}
                                  />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                  <div>
                                    <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block' }}>Price ($)</label>
                                    <input 
                                      type="number" 
                                      className="input input-dark" 
                                      style={{ fontSize: '0.8rem', padding: '6px' }}
                                      value={svc.price || 0}
                                      onChange={(e) => updateParlorServiceField(svc.id, 'price', e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block' }}>Duration (min)</label>
                                    <input 
                                      type="number" 
                                      className="input input-dark" 
                                      style={{ fontSize: '0.8rem', padding: '6px' }}
                                      value={svc.duration || 0}
                                      onChange={(e) => updateParlorServiceField(svc.id, 'duration', e.target.value)}
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block' }}>Description</label>
                                  <textarea 
                                    rows={2}
                                    className="input input-dark" 
                                    style={{ fontSize: '0.8rem', padding: '6px' }}
                                    value={svc.description || ''}
                                    placeholder="Optional description..."
                                    onChange={(e) => updateParlorServiceField(svc.id, 'description', e.target.value)}
                                  />
                                </div>

                                {/* Custom cover image uploader */}
                                <div>
                                  <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block' }}>Card Cover Image</label>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {svc.image ? (
                                      <div style={{ position: 'relative', width: '100%', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                        <img src={svc.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                                        <button 
                                          type="button" 
                                          onClick={() => updateParlorServiceField(svc.id, 'image', '')}
                                          style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                        >
                                          <X size={14} />
                                        </button>
                                      </div>
                                    ) : (
                                      <div 
                                        onClick={() => document.getElementById(`builder-svc-img-input-${svc.id}`)?.click()}
                                        style={{ 
                                          border: '1px dashed var(--border)', borderRadius: '8px', padding: '12px', 
                                          textAlign: 'center', cursor: 'pointer', background: 'var(--bg-main)',
                                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                                        }}
                                      >
                                        <Plus size={16} color="var(--primary)" />
                                        <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Click to upload card cover</span>
                                      </div>
                                    )}
                                    <input 
                                      id={`builder-svc-img-input-${svc.id}`}
                                      type="file" 
                                      accept="image/*" 
                                      style={{ display: 'none' }} 
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          const reader = new FileReader();
                                          reader.onloadend = () => {
                                            updateParlorServiceField(svc.id, 'image', reader.result as string);
                                          };
                                          reader.readAsDataURL(file);
                                        }
                                      }}
                                    />
                                  </div>
                                </div>

                                <button 
                                  onClick={() => handleSaveParlorService(svc.id)}
                                  disabled={savingServiceId === svc.id}
                                  className="btn btn-primary btn-sm" 
                                  style={{ marginTop: '4px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                >
                                  {savingServiceId === svc.id ? (
                                    <RefreshCw className="spin" size={14} />
                                  ) : (
                                    <Save size={14} />
                                  )}
                                  Save Service Details
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <button onClick={() => handleUpdateSectionContent(editingSection.id, editingSection.content)} className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>
                    <Save size={16} style={{ marginRight: '6px' }} /> Save Changes
                  </button>
                </div>

              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Sliders size={48} style={{ opacity: 0.3, marginBottom: '16px', color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>Component Inspector</h3>
                <p style={{ fontSize: '0.85rem', maxWidth: '240px', marginTop: '8px' }}>
                  Click on any layout block in the central workspace canvas to modify its background, texts, styles, and card counts in real-time.
                </p>
              </div>
            )}
          </div>

        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <Globe size={64} style={{ color: 'var(--primary)', opacity: 0.3, marginBottom: '24px' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>No Website Profile Configured</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Establish your hotel or spa public booking web presence by generating a CMS instance in seconds.</p>
            <button onClick={() => setIsCreatingSite(true)} className="btn btn-primary">Create Your Website Now</button>
          </div>
        </div>
      )}

      {/* --- MODAL 1: Create Website --- */}
      {isCreatingSite && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px'
        }}>
          <div className="card glass" style={{ width: '100%', maxWidth: '500px', padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Launch New Website</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Launch a premium, public-facing CMS instance for your hospitality organization.</p>
            <form onSubmit={handleCreateSite} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Website Name *</label>
                <input 
                  type="text" 
                  className="input input-dark" 
                  placeholder="e.g. Modern Hospitality Resort & Spa"
                  value={newSiteData.title} 
                  onChange={(e) => setNewSiteData({ ...newSiteData, title: e.target.value })} 
                  required 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Subdomain Prefix *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input 
                    type="text" 
                    className="input input-dark" 
                    placeholder="e.g. modernresort"
                    value={newSiteData.subdomain} 
                    onChange={(e) => setNewSiteData({ ...newSiteData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '') })} 
                    required 
                  />
                  <span style={{ color: 'var(--text-muted)' }}>.kswtechzone.com.np</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Short Description / SEO Summary</label>
                <textarea 
                  rows={2} 
                  className="input input-dark" 
                  placeholder="Tell your guests what makes your destination unique..."
                  value={newSiteData.description} 
                  onChange={(e) => setNewSiteData({ ...newSiteData, description: e.target.value })} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Select Organization Brand</label>
                <select 
                  className="input input-dark" 
                  value={newSiteData.brandId} 
                  onChange={(e) => setNewSiteData({ ...newSiteData, brandId: e.target.value })}
                >
                  <option value="">-- Auto Create Brand Profile --</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsCreatingSite(false)} className="btn" style={{ background: 'transparent', border: '1px solid var(--border)' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px' }}>
                  Generate & Launch Site
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: Add Page --- */}
      {isAddingPage && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px'
        }}>
          <div className="card glass" style={{ width: '100%', maxWidth: '500px', padding: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '24px' }}>Add New Web Page</h2>
            <form onSubmit={handleAddPage} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Page Title *</label>
                <input 
                  type="text" 
                  className="input input-dark" 
                  placeholder="e.g. Fine Dining & Bars"
                  value={newPageData.title} 
                  onChange={(e) => setNewPageData({ ...newPageData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-') })} 
                  required 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>URL Slug *</label>
                <input 
                  type="text" 
                  className="input input-dark" 
                  placeholder="e.g. dining"
                  value={newPageData.slug} 
                  onChange={(e) => setNewPageData({ ...newPageData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} 
                  required 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>SEO Title Meta Tag</label>
                <input 
                  type="text" 
                  className="input input-dark" 
                  placeholder="e.g. Gourmet Dining Experience | Resort"
                  value={newPageData.seoTitle} 
                  onChange={(e) => setNewPageData({ ...newPageData, seoTitle: e.target.value })} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsAddingPage(false)} className="btn" style={{ background: 'transparent', border: '1px solid var(--border)' }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Page
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isFullscreenPreview && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: '#090d16', 
          zIndex: 99999, 
          display: 'flex', 
          flexDirection: 'column' 
        }}>
          {/* Top Control Bar */}
          <div style={{ 
            background: 'var(--bg-card)', 
            padding: '16px 32px', 
            borderBottom: '1px solid var(--border)', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            {/* Domain Address Mock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#eab308' }}></span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e' }}></span>
              <span style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '12px' }}>
                https://{selectedWebsite.customDomain || `${selectedWebsite.subdomain}.kswtechzone.com.np`}/{selectedPage?.slug === 'home' ? '' : selectedPage?.slug}
              </span>
            </div>

            {/* Device Toggles */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={() => setPreviewMode('desktop')} 
                className="btn" 
                style={{ 
                  padding: '8px 16px', 
                  background: previewMode === 'desktop' ? 'var(--primary)' : 'transparent', 
                  color: previewMode === 'desktop' ? 'white' : 'var(--text-muted)', 
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Monitor size={16} /> Desktop
              </button>
              <button 
                onClick={() => setPreviewMode('tablet')} 
                className="btn" 
                style={{ 
                  padding: '8px 16px', 
                  background: previewMode === 'tablet' ? 'var(--primary)' : 'transparent', 
                  color: previewMode === 'tablet' ? 'white' : 'var(--text-muted)', 
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Tablet size={16} /> Tablet
              </button>
              <button 
                onClick={() => setPreviewMode('mobile')} 
                className="btn" 
                style={{ 
                  padding: '8px 16px', 
                  background: previewMode === 'mobile' ? 'var(--primary)' : 'transparent', 
                  color: previewMode === 'mobile' ? 'white' : 'var(--text-muted)', 
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Phone size={16} /> Mobile
              </button>
            </div>

            {/* Exit Action Button */}
            <button 
              onClick={() => setIsFullscreenPreview(false)} 
              className="btn btn-primary"
              style={{ 
                padding: '8px 18px', 
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <X size={16} /> Exit Preview
            </button>
          </div>

          {/* Interactive Page Viewport Frame */}
          <div style={{ 
            flex: 1, 
            padding: previewMode === 'desktop' ? '0' : '40px 0', 
            overflowY: 'auto', 
            display: 'flex', 
            justifyContent: 'center', 
            background: '#0b111e' 
          }}>
            <div style={{ 
              width: previewMode === 'desktop' ? '100%' : previewMode === 'tablet' ? '768px' : '375px',
              background: 'white', 
              color: '#1e293b', 
              minHeight: '100%', 
              borderRadius: previewMode === 'desktop' ? '0' : '20px', 
              overflowX: 'hidden',
              boxShadow: previewMode === 'desktop' ? 'none' : '0 25px 50px -12px rgba(0,0,0,0.5)',
              transition: 'width 0.3s'
            }}>
              {/* Simulated Header */}
              <header style={{
                padding: '24px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: selectedWebsite.config?.headerStyle === 'solid' ? '#0f172a' : 'white',
                color: selectedWebsite.config?.headerStyle === 'solid' ? 'white' : '#0f172a',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: selectedWebsite.config?.primaryColor || '#A67653' }}></div>
                  <span style={{ fontWeight: 800, letterSpacing: '1px' }}>{selectedWebsite.title.toUpperCase()}</span>
                </div>
                <nav style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', fontWeight: 600 }}>
                  {(selectedWebsite.pages || []).map((p: any) => (
                    <span key={p.id} style={{ opacity: selectedPage?.id === p.id ? 1 : 0.6, borderBottom: selectedPage?.id === p.id ? `2px solid ${selectedWebsite.config?.primaryColor || '#A67653'}` : 'none', paddingBottom: '4px' }}>
                      {p.title}
                    </span>
                  ))}
                </nav>
              </header>

              {/* Dynamic CMS Layout Block Rendering (WITHOUT any editor borders or floating widgets!) */}
              {(selectedPage?.sections || []).length === 0 ? (
                <div style={{ padding: '80px 40px', textAlign: 'center', color: '#64748b' }}>
                  <Layout size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                  <p style={{ fontWeight: 600 }}>This page has no content blocks yet.</p>
                </div>
              ) : (
                (selectedPage.sections || [])
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((sec: any) => {
                    switch (sec.type) {
                      case 'HERO':
                        return <HeroSection key={sec.id} content={sec.content} config={selectedWebsite.config} previewMode={previewMode} />;
                      case 'FEATURES':
                        return <FeaturesSection key={sec.id} content={sec.content} config={selectedWebsite.config} previewMode={previewMode} />;
                      case 'ROOMS':
                        return <RoomsSection key={sec.id} content={sec.content} config={selectedWebsite.config} previewMode={previewMode} />;
                      case 'TESTIMONIALS':
                        return <TestimonialsSection key={sec.id} content={sec.content} config={selectedWebsite.config} previewMode={previewMode} />;
                      case 'PARLOR_SERVICES':
                        return <ServicesSection key={sec.id} content={sec.content} config={selectedWebsite.config} previewMode={previewMode} parlorServicesData={parlorServicesData} tenantSlug={selectedWebsite.subdomain} />;
                      default:
                        return null;
                    }
                  })
              )}

              {/* Simulated Footer */}
              <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '48px 32px', textAlign: 'center', borderTop: '1px solid #1e293b' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'white', fontWeight: 600 }}>{selectedWebsite.title}</p>
                <p style={{ fontSize: '0.8rem', margin: 0 }}>© {new Date().getFullYear()} KSWMS Platform. All rights reserved.</p>
              </footer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
