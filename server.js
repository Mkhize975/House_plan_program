const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory store for user saved blueprints
const blueprints = new Map();

// Preset templates inspired by South African contemporary dream home architecture (Archid style)
const defaultTemplates = [
  {
    id: 'floating-cantilever-villa',
    title: 'The Floating Cantilever Villa - 4-Bedroom Architectural Box House',
    description: 'Iconic modern floating cantilever design featuring a bold dark portal frame, vertical teak timber slats, cantilevered upper floor with integrated planter balconies, double-volume open lounge, covered braai patio, and sparkling pool.',
    category: 'Floating Cantilever Modern',
    image: '/images/floating_villa_facade.jpg',
    totalArea: '385 m² (4,144 sq ft)',
    dimensions: { width: 58, length: 68 },
    standSize: '750 m² minimum stand',
    specs: {
      bedrooms: 4,
      bathrooms: 4.5,
      garages: 2,
      levels: 2,
      features: ['Floating Box Frame', 'Vertical Timber Slats', 'Planter Balconies', 'Built-in Braai', 'Sparkling Pool', 'Double-Volume Foyer']
    },
    rooms: [
      // Ground Floor
      { id: 'r1', type: 'Living Room', name: 'Double-Volume Living Salon', level: 1, x: 40, y: 40, width: 260, height: 180, color: '#e0f2fe', labelColor: '#0369a1', material: 'stucco' },
      { id: 'r2', type: 'Dining Room', name: 'Open-Plan Dining Area', level: 1, x: 300, y: 40, width: 160, height: 180, color: '#f1f5f9', labelColor: '#475569', material: 'stucco' },
      { id: 'r3', type: 'Kitchen', name: 'Designer Kitchen & Island Bar', level: 1, x: 460, y: 40, width: 180, height: 180, color: '#fef3c7', labelColor: '#b45309', material: 'stucco' },
      { id: 'r4', type: 'Scullery', name: 'Scullery & Laundry Suite', level: 1, x: 640, y: 40, width: 120, height: 180, color: '#ffedd5', labelColor: '#c2410c', material: 'stucco' },
      { id: 'r5', type: 'Patio', name: 'Covered Braai Entertainment Patio', level: 1, x: 40, y: 220, width: 280, height: 140, color: '#fef08a', labelColor: '#a16207', material: 'timber' },
      { id: 'r6', type: 'Pool', name: 'Sparkling Pool & Sun Deck', level: 1, x: 40, y: 360, width: 280, height: 160, color: '#38bdf8', labelColor: '#0369a1', material: 'water' },
      { id: 'r7', type: 'Foyer', name: 'Entrance Foyer & Feature Column', level: 1, x: 320, y: 220, width: 140, height: 140, color: '#f8fafc', labelColor: '#0f172a', material: 'stone' },
      { id: 'r8', type: 'Office', name: 'Executive Home Study', level: 1, x: 460, y: 220, width: 160, height: 140, color: '#e0e7ff', labelColor: '#4338ca', material: 'stucco' },
      { id: 'r9', type: 'Bedroom', name: 'Ground Guest Suite (Ensuite)', level: 1, x: 620, y: 220, width: 180, height: 160, color: '#fae8ff', labelColor: '#a21caf', material: 'stucco' },
      { id: 'r10', type: 'Garage', name: 'Automated Double Garage', level: 1, x: 460, y: 360, width: 200, height: 220, color: '#e2e8f0', labelColor: '#334155', material: 'stone' },
      { id: 'r11', type: 'Staff', name: 'Staff Quarters (SQ Ensuite)', level: 1, x: 660, y: 380, width: 140, height: 140, color: '#dcfce7', labelColor: '#15803d', material: 'stucco' },
      
      // Upper Floor (Cantilevered Projection)
      { id: 'r12', type: 'Pyjama Lounge', name: 'Upstairs Pyjama Retreat', level: 2, x: 300, y: 40, width: 200, height: 160, color: '#ede9fe', labelColor: '#6d28d9', material: 'stucco' },
      { id: 'r13', type: 'Master Bedroom', name: 'Cantilever Master Suite', level: 2, x: 40, y: 40, width: 260, height: 200, color: '#fbcfe8', labelColor: '#9d174d', material: 'stucco' },
      { id: 'r14', type: 'Bathroom', name: 'Master Ensuite Spa & Dressing', level: 2, x: 40, y: 240, width: 180, height: 120, color: '#ccfbf1', labelColor: '#0f766e', material: 'stucco' },
      { id: 'r15', type: 'Balcony', name: 'Floating Planter Balcony', level: 2, x: 40, y: 360, width: 260, height: 80, color: '#cffafe', labelColor: '#0891b2', material: 'glass' },
      { id: 'r16', type: 'Bedroom', name: 'Bedroom 2 (Ensuite)', level: 2, x: 500, y: 40, width: 160, height: 160, color: '#ede9fe', labelColor: '#6d28d9', material: 'stucco' },
      { id: 'r17', type: 'Bedroom', name: 'Bedroom 3 (Ensuite)', level: 2, x: 500, y: 200, width: 160, height: 160, color: '#ede9fe', labelColor: '#6d28d9', material: 'stucco' }
    ]
  },
  {
    id: 'serengeti-double-storey',
    title: 'The Serengeti - 4-Bedroom Contemporary Double-Storey',
    description: 'Iconic South African luxury design with double-volume entrance, covered patio with built-in braai, swimming pool, pyjama lounge, scullery, and staff quarters.',
    category: 'Double Storey Luxury',
    image: '/images/floating_cantilever_sunset.jpg',
    totalArea: '420 m² (4,520 sq ft)',
    dimensions: { width: 62, length: 72 },
    standSize: '850 m² minimum stand',
    specs: {
      bedrooms: 4,
      bathrooms: 4.5,
      garages: 2,
      levels: 2,
      features: ['Built-in Braai', 'Swimming Pool', 'Pyjama Lounge', 'Scullery', 'Staff Quarters', 'Double-Volume Foyer']
    },
    rooms: [
      // Ground Floor
      { id: 'r1', type: 'Living Room', name: 'Open-Plan Grand Lounge', level: 1, x: 40, y: 40, width: 240, height: 180, color: '#e0f2fe', labelColor: '#0369a1', material: 'stucco' },
      { id: 'r2', type: 'Dining Room', name: 'Dining Room', level: 1, x: 280, y: 40, width: 160, height: 180, color: '#f1f5f9', labelColor: '#475569', material: 'stucco' },
      { id: 'r3', type: 'Kitchen', name: 'Gourmet Kitchen & Island', level: 1, x: 440, y: 40, width: 180, height: 180, color: '#fef3c7', labelColor: '#b45309', material: 'stucco' },
      { id: 'r4', type: 'Scullery', name: 'Scullery & Laundry', level: 1, x: 620, y: 40, width: 120, height: 180, color: '#ffedd5', labelColor: '#c2410c', material: 'stucco' },
      { id: 'r5', type: 'Patio', name: 'Covered Braai Patio', level: 1, x: 40, y: 220, width: 280, height: 140, color: '#fef08a', labelColor: '#a16207', material: 'timber' },
      { id: 'r6', type: 'Pool', name: 'Swimming Pool & Sun Deck', level: 1, x: 40, y: 360, width: 280, height: 160, color: '#38bdf8', labelColor: '#0369a1', material: 'water' },
      { id: 'r7', type: 'Foyer', name: 'Double-Volume Foyer', level: 1, x: 320, y: 220, width: 140, height: 140, color: '#f8fafc', labelColor: '#0f172a', material: 'stone' },
      { id: 'r8', type: 'Office', name: 'Executive Study / Office', level: 1, x: 460, y: 220, width: 160, height: 140, color: '#e0e7ff', labelColor: '#4338ca', material: 'stucco' },
      { id: 'r9', type: 'Bedroom', name: 'Ground Guest Suite (Ensuite)', level: 1, x: 620, y: 220, width: 180, height: 160, color: '#fae8ff', labelColor: '#a21caf', material: 'stucco' },
      { id: 'r10', type: 'Garage', name: 'Double Automated Garage', level: 1, x: 460, y: 360, width: 200, height: 220, color: '#e2e8f0', labelColor: '#334155', material: 'stone' },
      { id: 'r11', type: 'Staff', name: 'Staff Quarters (SQ + Bath)', level: 1, x: 660, y: 380, width: 140, height: 140, color: '#dcfce7', labelColor: '#15803d', material: 'stucco' },
      
      // Upper Floor
      { id: 'r12', type: 'Pyjama Lounge', name: 'Upstairs Pyjama Lounge', level: 2, x: 320, y: 40, width: 180, height: 160, color: '#ede9fe', labelColor: '#6d28d9', material: 'stucco' },
      { id: 'r13', type: 'Master Bedroom', name: 'Master Suite & Dressing Room', level: 2, x: 40, y: 40, width: 280, height: 200, color: '#fbcfe8', labelColor: '#9d174d', material: 'stucco' },
      { id: 'r14', type: 'Bathroom', name: 'Master Ensuite Spa Bath', level: 2, x: 40, y: 240, width: 180, height: 120, color: '#ccfbf1', labelColor: '#0f766e', material: 'stucco' },
      { id: 'r15', type: 'Balcony', name: 'Master Glass Balcony', level: 2, x: 40, y: 360, width: 280, height: 80, color: '#cffafe', labelColor: '#0891b2', material: 'glass' },
      { id: 'r16', type: 'Bedroom', name: 'Bedroom 2 (Ensuite)', level: 2, x: 500, y: 40, width: 160, height: 160, color: '#ede9fe', labelColor: '#6d28d9', material: 'stucco' },
      { id: 'r17', type: 'Bedroom', name: 'Bedroom 3 (Ensuite)', level: 2, x: 500, y: 200, width: 160, height: 160, color: '#ede9fe', labelColor: '#6d28d9', material: 'stucco' }
    ]
  },
  {
    id: 'lowveld-sanctuary',
    title: 'The Lowveld Sanctuary - 3-Bedroom Contemporary Villa',
    description: 'Single-storey South African modern design with stacking doors connecting the grand living areas to a covered braai patio, sparkling pool, and boma firepit.',
    category: 'Single Storey Contemporary',
    image: '/images/floating_modern_haven.jpg',
    totalArea: '285 m² (3,067 sq ft)',
    dimensions: { width: 55, length: 65 },
    standSize: '650 m² stand',
    specs: {
      bedrooms: 3,
      bathrooms: 2.5,
      garages: 2,
      levels: 1,
      features: ['Built-in Braai', 'Swimming Pool', 'Boma Firepit', 'Scullery', 'Stacking Doors']
    },
    rooms: [
      { id: 'r1', type: 'Living Room', name: 'Open-Plan Living Hall', level: 1, x: 40, y: 40, width: 240, height: 180, color: '#e0f2fe', labelColor: '#0369a1', material: 'stucco' },
      { id: 'r2', type: 'Dining Room', name: 'Dining Room', level: 1, x: 280, y: 40, width: 160, height: 180, color: '#f1f5f9', labelColor: '#475569', material: 'stucco' },
      { id: 'r3', type: 'Kitchen', name: 'Chef Kitchen & Breakfast Bar', level: 1, x: 440, y: 40, width: 160, height: 180, color: '#fef3c7', labelColor: '#b45309', material: 'stucco' },
      { id: 'r4', type: 'Scullery', name: 'Scullery & Pantry', level: 1, x: 600, y: 40, width: 120, height: 180, color: '#ffedd5', labelColor: '#c2410c', material: 'stucco' },
      { id: 'r5', type: 'Patio', name: 'Covered Braai Entertainment Patio', level: 1, x: 40, y: 220, width: 260, height: 140, color: '#fef08a', labelColor: '#a16207', material: 'timber' },
      { id: 'r6', type: 'Pool', name: 'Swimming Pool & Sun Deck', level: 1, x: 40, y: 360, width: 260, height: 150, color: '#38bdf8', labelColor: '#0369a1', material: 'water' },
      { id: 'r7', type: 'Boma', name: 'Sunken Boma & Firepit', level: 1, x: 300, y: 360, width: 140, height: 150, color: '#fed7aa', labelColor: '#9a3412', material: 'stone' },
      { id: 'r8', type: 'Master Bedroom', name: 'Master Suite (Ensuite + WIC)', level: 1, x: 300, y: 220, width: 200, height: 140, color: '#fae8ff', labelColor: '#a21caf', material: 'stucco' },
      { id: 'r9', type: 'Bedroom', name: 'Bedroom 2', level: 1, x: 500, y: 220, width: 140, height: 140, color: '#ede9fe', labelColor: '#6d28d9', material: 'stucco' },
      { id: 'r10', type: 'Bedroom', name: 'Bedroom 3', level: 1, x: 640, y: 220, width: 140, height: 140, color: '#ede9fe', labelColor: '#6d28d9', material: 'stucco' },
      { id: 'r11', type: 'Garage', name: 'Double Automated Garage', level: 1, x: 500, y: 360, width: 200, height: 200, color: '#e2e8f0', labelColor: '#334155', material: 'stone' }
    ]
  },
  {
    id: 'constantia-crest',
    title: 'The Constantia Crest - 5-Bedroom Architectural Masterpiece',
    description: 'Grand architectural statement with 5 ensuite bedrooms, cinema room, wine tasting cellar, dual covered braai pavilions, rim-flow pool, staff quarters, and triple garage.',
    category: 'Signature Luxury Estate',
    image: '/images/floating_luxury_estate.jpg',
    totalArea: '580 m² (6,243 sq ft)',
    dimensions: { width: 75, length: 85 },
    standSize: '1,200 m² stand',
    specs: {
      bedrooms: 5,
      bathrooms: 5.5,
      garages: 3,
      levels: 2,
      features: ['Dual Braai Patios', 'Rim-Flow Pool', 'Cinema Lounge', 'Wine Cellar', 'Staff Quarters', 'Triple Garage']
    },
    rooms: [
      // Ground Floor
      { id: 'r1', type: 'Living Room', name: 'Grand Double-Volume Salon', level: 1, x: 40, y: 40, width: 280, height: 200, color: '#e0f2fe', labelColor: '#0369a1', material: 'stone' },
      { id: 'r2', type: 'Dining Room', name: 'Formal Dining Hall', level: 1, x: 320, y: 40, width: 180, height: 200, color: '#f1f5f9', labelColor: '#475569', material: 'stucco' },
      { id: 'r3', type: 'Kitchen', name: 'Chef Show Kitchen & Island', level: 1, x: 500, y: 40, width: 200, height: 200, color: '#fef3c7', labelColor: '#b45309', material: 'stucco' },
      { id: 'r4', type: 'Scullery', name: 'Walk-In Scullery & Pantry', level: 1, x: 700, y: 40, width: 140, height: 200, color: '#ffedd5', labelColor: '#c2410c', material: 'stucco' },
      { id: 'r5', type: 'Patio', name: 'Covered Braai Lounge & Bar', level: 1, x: 40, y: 240, width: 320, height: 160, color: '#fef08a', labelColor: '#a16207', material: 'timber' },
      { id: 'r6', type: 'Pool', name: 'Infinity Rim-Flow Pool', level: 1, x: 40, y: 400, width: 320, height: 180, color: '#38bdf8', labelColor: '#0369a1', material: 'water' },
      { id: 'r7', type: 'Boma', name: 'Sunken Boma Lounge', level: 1, x: 360, y: 400, width: 160, height: 180, color: '#fed7aa', labelColor: '#9a3412', material: 'stone' },
      { id: 'r8', type: 'Bedroom', name: 'Ground Presidential Guest Suite', level: 1, x: 360, y: 240, width: 200, height: 160, color: '#fae8ff', labelColor: '#a21caf', material: 'stucco' },
      { id: 'r9', type: 'Office', name: 'Executive Library & Study', level: 1, x: 560, y: 240, width: 160, height: 160, color: '#e0e7ff', labelColor: '#4338ca', material: 'stucco' },
      { id: 'r10', type: 'Garage', name: '3-Car Showroom Garage', level: 1, x: 520, y: 400, width: 240, height: 240, color: '#e2e8f0', labelColor: '#334155', material: 'stone' },
      { id: 'r11', type: 'Staff', name: 'Staff Cottage (SQ Ensuite)', level: 1, x: 760, y: 400, width: 140, height: 160, color: '#dcfce7', labelColor: '#15803d', material: 'stucco' },
      
      // Upper Floor
      { id: 'r12', type: 'Pyjama Lounge', name: 'Upper Pyjama Lounge & Cinema', level: 2, x: 320, y: 40, width: 220, height: 180, color: '#ede9fe', labelColor: '#6d28d9', material: 'stucco' },
      { id: 'r13', type: 'Master Bedroom', name: 'Presidential Master Suite', level: 2, x: 40, y: 40, width: 280, height: 220, color: '#fbcfe8', labelColor: '#9d174d', material: 'stucco' },
      { id: 'r14', type: 'Bathroom', name: 'Master Ensuite & Walk-in Dressing', level: 2, x: 40, y: 260, width: 220, height: 140, color: '#ccfbf1', labelColor: '#0f766e', material: 'stucco' },
      { id: 'r15', type: 'Balcony', name: 'Private Sunset Terrace', level: 2, x: 40, y: 400, width: 280, height: 80, color: '#cffafe', labelColor: '#0891b2', material: 'glass' },
      { id: 'r16', type: 'Bedroom', name: 'Suite 2 (Ensuite)', level: 2, x: 540, y: 40, width: 180, height: 180, color: '#ede9fe', labelColor: '#6d28d9', material: 'stucco' },
      { id: 'r17', type: 'Bedroom', name: 'Suite 3 (Ensuite)', level: 2, x: 540, y: 220, width: 180, height: 160, color: '#ede9fe', labelColor: '#6d28d9', material: 'stucco' },
      { id: 'r18', type: 'Bedroom', name: 'Suite 4 (Ensuite)', level: 2, x: 720, y: 40, width: 160, height: 180, color: '#ede9fe', labelColor: '#6d28d9', material: 'stucco' }
    ]
  },
  {
    id: 'karoo-vista',
    title: 'The Karoo Vista - 2-Bedroom Modern Eco-Home',
    description: 'Compact, energy-efficient modern South African design with open-plan flow, covered braai patio, plunge pool, and natural stone accents.',
    category: 'Compact Eco Living',
    image: '/images/floating_cantilever_sunset.jpg',
    totalArea: '165 m² (1,776 sq ft)',
    dimensions: { width: 42, length: 48 },
    standSize: '400 m² stand',
    specs: {
      bedrooms: 2,
      bathrooms: 2,
      garages: 1,
      levels: 1,
      features: ['Braai Patio', 'Plunge Pool', 'Open-Plan Living', 'Single Garage', 'Stone Accents']
    },
    rooms: [
      { id: 'r1', type: 'Living Room', name: 'Open Living & Lounge', level: 1, x: 40, y: 40, width: 220, height: 180, color: '#e0f2fe', labelColor: '#0369a1', material: 'stucco' },
      { id: 'r2', type: 'Kitchen', name: 'Modern Kitchen & Nook', level: 1, x: 260, y: 40, width: 160, height: 180, color: '#fef3c7', labelColor: '#b45309', material: 'stucco' },
      { id: 'r3', type: 'Patio', name: 'Covered Braai Veranda', level: 1, x: 40, y: 220, width: 220, height: 140, color: '#fef08a', labelColor: '#a16207', material: 'timber' },
      { id: 'r4', type: 'Pool', name: 'Plunge Pool & Deck', level: 1, x: 40, y: 360, width: 220, height: 120, color: '#38bdf8', labelColor: '#0369a1', material: 'water' },
      { id: 'r5', type: 'Master Bedroom', name: 'Master Suite (Ensuite)', level: 1, x: 260, y: 220, width: 180, height: 160, color: '#fae8ff', labelColor: '#a21caf', material: 'stucco' },
      { id: 'r6', type: 'Bedroom', name: 'Bedroom 2', level: 1, x: 260, y: 380, width: 160, height: 140, color: '#ede9fe', labelColor: '#6d28d9', material: 'stucco' },
      { id: 'r7', type: 'Garage', name: 'Automated Single Garage', level: 1, x: 420, y: 40, width: 160, height: 220, color: '#e2e8f0', labelColor: '#334155', material: 'stone' }
    ]
  }
];

// Initialize default templates in map
defaultTemplates.forEach(t => blueprints.set(t.id, t));

// API Routes
app.get('/api/templates', (req, res) => {
  res.json(Array.from(blueprints.values()));
});

app.get('/api/templates/:id', (req, res) => {
  const blueprint = blueprints.get(req.params.id);
  if (!blueprint) {
    return res.status(404).json({ error: 'Blueprint template not found' });
  }
  res.json(blueprint);
});

app.post('/api/blueprints/save', (req, res) => {
  const { id, title, description, rooms, dimensions, totalArea } = req.body;
  const planId = id || `plan-${Date.now()}`;
  const record = {
    id: planId,
    title: title || 'Custom House Plan',
    description: description || 'User designed architectural plan',
    category: 'Custom',
    totalArea: totalArea || 'Custom Size',
    dimensions: dimensions || { width: 40, length: 50 },
    rooms: rooms || [],
    updatedAt: new Date().toISOString()
  };
  blueprints.set(planId, record);
  res.json({ success: true, blueprint: record });
});

// AI Blueprint Generation Endpoint
app.post('/api/generate-blueprint', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const promptLower = prompt.toLowerCase();
  
  // Intelligent procedural generation based on prompt keywords
  let rooms = [];
  let title = 'Custom Architectural Plan';
  let category = 'South African Modern';

  const hasGarage = promptLower.includes('garage') || promptLower.includes('car');
  const hasTripleGarage = promptLower.includes('3 car') || promptLower.includes('triple garage');
  const isDoubleStorey = promptLower.includes('double') || promptLower.includes('2 story') || promptLower.includes('2-story') || promptLower.includes('2 storey') || promptLower.includes('two story') || promptLower.includes('two storey');
  const hasPool = promptLower.includes('pool') || promptLower.includes('swimming') || promptLower.includes('deck') || promptLower.includes('luxury') || promptLower.includes('villa');
  const hasBraai = promptLower.includes('braai') || promptLower.includes('patio') || promptLower.includes('entertainment') || promptLower.includes('bbq') || promptLower.includes('veranda') || true; // Standard in South African dream homes
  const hasBoma = promptLower.includes('boma') || promptLower.includes('firepit') || promptLower.includes('fire pit') || promptLower.includes('luxury');
  const hasScullery = promptLower.includes('scullery') || promptLower.includes('pantry') || promptLower.includes('laundry') || promptLower.includes('3 bed') || promptLower.includes('4 bed') || promptLower.includes('luxury');
  const hasStaff = promptLower.includes('staff') || promptLower.includes('sq') || promptLower.includes('helper') || promptLower.includes('domestic') || promptLower.includes('maid') || promptLower.includes('luxury');
  const hasStudy = promptLower.includes('study') || promptLower.includes('office') || promptLower.includes('work') || promptLower.includes('library');
  const isLuxury = promptLower.includes('luxury') || promptLower.includes('villa') || promptLower.includes('mansion') || promptLower.includes('estate') || promptLower.includes('grand');

  const isBeds2 = promptLower.includes('2 bed') || promptLower.includes('2-bed') || promptLower.includes('two bed');
  const isBeds3 = promptLower.includes('3 bed') || promptLower.includes('3-bed') || promptLower.includes('three bed');
  const isBeds4 = promptLower.includes('4 bed') || promptLower.includes('4-bed') || promptLower.includes('four bed') || (!isBeds2 && !isBeds3 && !promptLower.includes('1 bed'));
  const isBeds5 = promptLower.includes('5 bed') || promptLower.includes('5-bed') || promptLower.includes('five bed');

  // GROUND FLOOR / LEVEL 1
  // Open-Plan Living & Dining
  rooms.push({
    id: 'ai-living',
    type: 'Living Room',
    name: isLuxury ? 'Double-Volume Living Hall' : 'Open-Plan Living Lounge',
    level: 1,
    x: 40,
    y: 40,
    width: isLuxury ? 280 : 240,
    height: 180,
    color: '#e0f2fe',
    labelColor: '#0369a1',
    material: isLuxury ? 'stone' : 'stucco'
  });

  rooms.push({
    id: 'ai-dining',
    type: 'Dining Room',
    name: 'Dining Area',
    level: 1,
    x: isLuxury ? 320 : 280,
    y: 40,
    width: 160,
    height: 180,
    color: '#f1f5f9',
    labelColor: '#475569',
    material: 'stucco'
  });

  // Kitchen
  rooms.push({
    id: 'ai-kitchen',
    type: 'Kitchen',
    name: 'Designer Kitchen & Island',
    level: 1,
    x: isLuxury ? 480 : 440,
    y: 40,
    width: 180,
    height: 180,
    color: '#fef3c7',
    labelColor: '#b45309',
    material: 'stucco'
  });

  // Scullery
  if (hasScullery) {
    rooms.push({
      id: 'ai-scullery',
      type: 'Scullery',
      name: 'Scullery & Laundry',
      level: 1,
      x: isLuxury ? 660 : 620,
      y: 40,
      width: 130,
      height: 180,
      color: '#ffedd5',
      labelColor: '#c2410c',
      material: 'stucco'
    });
  }

  // Covered Braai Patio
  if (hasBraai) {
    rooms.push({
      id: 'ai-patio',
      type: 'Patio',
      name: 'Covered Braai Entertainment Patio',
      level: 1,
      x: 40,
      y: 220,
      width: isLuxury ? 300 : 260,
      height: 140,
      color: '#fef08a',
      labelColor: '#a16207',
      material: 'timber'
    });
  }

  // Swimming Pool
  if (hasPool) {
    rooms.push({
      id: 'ai-pool',
      type: 'Pool',
      name: 'Swimming Pool & Sun Deck',
      level: 1,
      x: 40,
      y: 360,
      width: isLuxury ? 300 : 260,
      height: 160,
      color: '#38bdf8',
      labelColor: '#0369a1',
      material: 'water'
    });
  }

  // Boma / Firepit
  if (hasBoma) {
    rooms.push({
      id: 'ai-boma',
      type: 'Boma',
      name: 'Sunken Boma & Firepit',
      level: 1,
      x: isLuxury ? 340 : 300,
      y: 360,
      width: 140,
      height: 160,
      color: '#fed7aa',
      labelColor: '#9a3412',
      material: 'stone'
    });
  }

  // Study / Office
  if (hasStudy) {
    rooms.push({
      id: 'ai-study',
      type: 'Office',
      name: 'Home Office / Study',
      level: 1,
      x: 300,
      y: 220,
      width: 160,
      height: 140,
      color: '#e0e7ff',
      labelColor: '#4338ca',
      material: 'stucco'
    });
  }

  // Ground Floor Guest Suite or Master Bedroom (if single storey)
  if (isDoubleStorey) {
    rooms.push({
      id: 'ai-guest-suite',
      type: 'Bedroom',
      name: 'Ground Guest Suite (Ensuite)',
      level: 1,
      x: 460,
      y: 220,
      width: 180,
      height: 140,
      color: '#fae8ff',
      labelColor: '#a21caf',
      material: 'stucco'
    });

    // Upper Floor Rooms
    rooms.push({
      id: 'ai-pyjama',
      type: 'Pyjama Lounge',
      name: 'Upstairs Pyjama Lounge',
      level: 2,
      x: 300,
      y: 40,
      width: 200,
      height: 160,
      color: '#ede9fe',
      labelColor: '#6d28d9',
      material: 'stucco'
    });

    rooms.push({
      id: 'ai-upper-master',
      type: 'Master Bedroom',
      name: 'Master Suite & Walk-in Dressing',
      level: 2,
      x: 40,
      y: 40,
      width: 260,
      height: 200,
      color: '#fbcfe8',
      labelColor: '#9d174d',
      material: 'stucco'
    });

    rooms.push({
      id: 'ai-upper-bath',
      type: 'Bathroom',
      name: 'Master Ensuite Spa Bath',
      level: 2,
      x: 40,
      y: 240,
      width: 180,
      height: 120,
      color: '#ccfbf1',
      labelColor: '#0f766e',
      material: 'stucco'
    });

    rooms.push({
      id: 'ai-balcony',
      type: 'Balcony',
      name: 'Glass Balcony Terrace',
      level: 2,
      x: 40,
      y: 360,
      width: 260,
      height: 80,
      color: '#cffafe',
      labelColor: '#0891b2',
      material: 'glass'
    });

    rooms.push({
      id: 'ai-bed2',
      type: 'Bedroom',
      name: 'Bedroom 2 (Ensuite)',
      level: 2,
      x: 500,
      y: 40,
      width: 160,
      height: 160,
      color: '#ede9fe',
      labelColor: '#6d28d9',
      material: 'stucco'
    });

    if (isBeds4 || isBeds5) {
      rooms.push({
        id: 'ai-bed3',
        type: 'Bedroom',
        name: 'Bedroom 3 (Ensuite)',
        level: 2,
        x: 500,
        y: 200,
        width: 160,
        height: 160,
        color: '#ede9fe',
        labelColor: '#6d28d9',
        material: 'stucco'
      });
    }

    if (isBeds5) {
      rooms.push({
        id: 'ai-bed4',
        type: 'Bedroom',
        name: 'Bedroom 4 (Ensuite)',
        level: 2,
        x: 660,
        y: 40,
        width: 160,
        height: 160,
        color: '#ede9fe',
        labelColor: '#6d28d9',
        material: 'stucco'
      });
    }
  } else {
    // Single Storey Bedrooms
    rooms.push({
      id: 'ai-master',
      type: 'Master Bedroom',
      name: 'Master Suite & Dressing Room',
      level: 1,
      x: 300,
      y: 220,
      width: 200,
      height: 140,
      color: '#fae8ff',
      labelColor: '#a21caf',
      material: 'stucco'
    });

    rooms.push({
      id: 'ai-bed2',
      type: 'Bedroom',
      name: 'Bedroom 2',
      level: 1,
      x: 500,
      y: 220,
      width: 150,
      height: 140,
      color: '#ede9fe',
      labelColor: '#6d28d9',
      material: 'stucco'
    });

    if (isBeds3 || isBeds4 || isBeds5) {
      rooms.push({
        id: 'ai-bed3',
        type: 'Bedroom',
        name: 'Bedroom 3',
        level: 1,
        x: 650,
        y: 220,
        width: 150,
        height: 140,
        color: '#ede9fe',
        labelColor: '#6d28d9',
        material: 'stucco'
      });
    }

    if (isBeds4 || isBeds5) {
      rooms.push({
        id: 'ai-bed4',
        type: 'Bedroom',
        name: 'Bedroom 4 / Guest Suite',
        level: 1,
        x: 650,
        y: 360,
        width: 150,
        height: 140,
        color: '#ede9fe',
        labelColor: '#6d28d9',
        material: 'stucco'
      });
    }
  }

  // Garage
  if (hasGarage || true) {
    const garageWidth = hasTripleGarage ? 260 : 200;
    rooms.push({
      id: 'ai-garage',
      type: 'Garage',
      name: hasTripleGarage ? '3-Car Automated Garage' : 'Double Automated Garage',
      level: 1,
      x: 480,
      y: 360,
      width: garageWidth,
      height: 200,
      color: '#e2e8f0',
      labelColor: '#334155',
      material: 'stone'
    });
  }

  // Staff Quarters
  if (hasStaff) {
    rooms.push({
      id: 'ai-staff',
      type: 'Staff',
      name: 'Staff Quarters (SQ Ensuite)',
      level: 1,
      x: 680,
      y: 360,
      width: 130,
      height: 140,
      color: '#dcfce7',
      labelColor: '#15803d',
      material: 'stucco'
    });
  }

  // Calculate approximate bounds and areas
  let maxX = 0;
  let maxY = 0;
  let groundAreaSqft = 0;
  let upperAreaSqft = 0;

  rooms.forEach(r => {
    maxX = Math.max(maxX, r.x + r.width);
    maxY = Math.max(maxY, r.y + r.height);
    const w = Math.round(r.width / 12);
    const h = Math.round(r.height / 12);
    if (r.level === 2) {
      upperAreaSqft += (w * h * 10);
    } else {
      groundAreaSqft += (w * h * 10);
    }
  });

  const totalSqft = groundAreaSqft + upperAreaSqft;
  const totalM2 = Math.round(totalSqft * 0.092903);
  const widthMeters = Math.round(maxX / 35);
  const lengthMeters = Math.round(maxY / 35);

  title = `Custom ${prompt.charAt(0).toUpperCase() + prompt.slice(1).slice(0, 38)}`;
  const totalArea = `${totalM2} m² (${totalSqft.toLocaleString()} sq ft)`;
  const dimensions = { width: Math.round(maxX / 12), length: Math.round(maxY / 12) };

  res.json({
    success: true,
    prompt,
    title,
    category: isDoubleStorey ? 'Double Storey Contemporary' : 'Single Storey Contemporary',
    totalArea,
    totalM2,
    dimensions,
    rooms,
    aiSummary: `Generated South African modern architectural blueprint for "${prompt}" with ${rooms.length} zoned spaces, outdoor braai entertainment integration, metric m² calibration, and realistic structural flow.`
  });
});

// Serve static assets from public/ and House Plan Hologram/app/src/
const publicDir = path.join(__dirname, 'public');
const appSrcDir = path.join(__dirname, 'House Plan Hologram', 'app', 'src');

app.use(express.static(publicDir));
app.use(express.static(appSrcDir));

// Fallback to index.html for root or unmatched routes
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/designer', (req, res) => {
  res.sendFile(path.join(publicDir, 'designer.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DreamDwell 3D House Plan Server running on http://0.0.0.0:${PORT}`);
});
