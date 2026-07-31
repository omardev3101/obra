import React, { useState, useRef, useEffect } from 'react';
import { 
  MousePointer, 
  Square, 
  Undo, 
  Redo, 
  Trash2, 
  Layers, 
  Map, 
  Rotate3d, 
  Maximize2, 
  Send,
  Edit,
  DoorClosed,
  Grid3X3,
  Minimize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

const Rates = {
  PVC: { materialLabor: 75, laborOnly: 35, name: "Forro de PVC - Branco Neve", color: "#e2e8f0" },
  Drywall: { materialLabor: 110, laborOnly: 55, name: "Divisória de Drywall - Padrão Simples", color: "#fef08a" },
  Gesso: { materialLabor: 95, laborOnly: 45, name: "Forro de Gesso - Standard", color: "#ffffff" }
};

const Calculator = ({ onOpenLeadModal }) => {
  const [items, setItems] = useState([
    {
      id: '1',
      ambiente: 'Sala de Estar',
      estrutura: 'Drywall',
      largura: 4.0,
      comprimento: 3.5,
      tipoServico: 'Material + M.O.',
      isolamento: true,
      valor: 1690.00
    }
  ]);

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [ambiente, setAmbiente] = useState('Sala de Estar');
  const [estrutura, setEstrutura] = useState('Drywall');
  const [largura, setLargura] = useState(4.0);
  const [comprimento, setComprimento] = useState(3.5);
  const [tipoServico, setTipoServico] = useState('Material + M.O.');
  const [isolamento, setIsolamento] = useState(false);

  // Tab de Visualização
  const [activeView, setActiveView] = useState('Frontal'); // 'Frontal' | '2D' | '3D'

  // Estados do CAD/Desenho
  const [activeTool, setActiveTool] = useState('rect'); // 'select' | 'rect' | 'door' | 'window'
  const [elements, setElements] = useState([
    { id: '1', type: 'parede', x: 200, y: 80, w: 400, h: 160 },
    { id: '2', type: 'porta', x: 230, y: 156, w: 40, h: 84 },
    { id: '3', type: 'janela', x: 420, y: 110, w: 80, h: 60 }
  ]);

  // Histórico para Undo/Redo
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Controle de Zoom, Rotação 3D e Fullscreen
  const [zoomScale, setZoomScale] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(Math.PI / 6);
  const [isRotating3D, setIsRotating3D] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Estados de arrastar e criar
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDraggingElement, setIsDraggingElement] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  const [selectedId, setSelectedId] = useState(null);

  // Atualiza as dimensões calculadas baseadas no retângulo/parede desenhado
  useEffect(() => {
    const mainWall = elements.find(el => el.type === 'parede');
    if (mainWall) {
      const scale = 40;
      setLargura(parseFloat((mainWall.w / scale).toFixed(1)));
      setComprimento(parseFloat(((mainWall.w * 0.85) / scale).toFixed(1))); // Comprimento simulado proporcional
    } else {
      // Redefine para as dimensões mínimas caso o desenho tenha sido limpo
      setLargura(1.0);
      setComprimento(1.0);
    }
  }, [elements]);

  useEffect(() => {
    drawCanvas();
  }, [activeView, elements, activeTool, currentPos, isDrawing, zoomScale, selectedId, rotationAngle]);

  // Salvar estado atual no histórico antes de alterar
  const saveToHistory = (newElements) => {
    setHistory([...history, elements]);
    setElements(newElements);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setRedoStack([elements, ...redoStack]);
    setElements(previous);
    setHistory(history.slice(0, -1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory([...history, elements]);
    setElements(next);
    setRedoStack(redoStack.slice(1));
  };

  const handleClearDrawing = () => {
    saveToHistory([]);
    setSelectedId(null);
  };

  const handleSaveDrawing = () => {
    const drawingData = {
      ambiente,
      estrutura,
      largura,
      comprimento,
      tipoServico,
      isolamento,
      elements
    };
    const blob = new Blob([JSON.stringify(drawingData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${ambiente.toLowerCase().replace(/\s+/g, '-') || 'planta'}.drywall`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportDrawing = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.ambiente) setAmbiente(data.ambiente);
        if (data.estrutura) setEstrutura(data.estrutura);
        if (data.largura) setLargura(parseFloat(data.largura));
        if (data.comprimento) setComprimento(parseFloat(data.comprimento));
        if (data.tipoServico) setTipoServico(data.tipoServico);
        if (data.elements) saveToHistory(data.elements);
        alert('Desenho importado com sucesso!');
      } catch (err) {
        alert('Erro ao importar o arquivo .drywall');
      }
    };
    reader.readAsText(file);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Salva o estado do contexto para aplicar zoom
    ctx.save();
    ctx.scale(zoomScale, zoomScale);

    // 1. Desenha Grid de Fundo
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const gridSize = 20;
    for (let x = 0; x < w / zoomScale; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h / zoomScale);
      ctx.stroke();
    }
    for (let y = 0; y < h / zoomScale; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w / zoomScale, y);
      ctx.stroke();
    }

    if (activeView === 'Frontal' || activeView === '2D') {
      // 2. Renderiza Elementos CAD (Paredes, Portas, Janelas)
      elements.forEach((el) => {
        const isSelected = el.id === selectedId;
        
        if (el.type === 'parede') {
          // Renderiza Parede
          ctx.fillStyle = Rates[estrutura].color + (activeView === '2D' ? '22' : '33');
          ctx.fillRect(el.x, el.y, el.w, el.h);
          ctx.strokeStyle = isSelected ? '#3b82f6' : '#f59e0b';
          ctx.lineWidth = isSelected ? 4 : 2;
          ctx.strokeRect(el.x, el.y, el.w, el.h);

          // Cota de Medida
          ctx.fillStyle = '#ffffff';
          ctx.font = '11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`${(el.w / 40).toFixed(1)}m`, el.x + el.w / 2, el.y - 8);
        }

        if (el.type === 'porta') {
          // Renderiza Porta
          ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
          ctx.fillRect(el.x, el.y, el.w, el.h);
          ctx.strokeStyle = isSelected ? '#3b82f6' : '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(el.x, el.y, el.w, el.h);

          // Desenha arco da porta se for 2D
          if (activeView === '2D') {
            ctx.beginPath();
            ctx.arc(el.x, el.y + el.h, el.w, 0, -Math.PI / 2, true);
            ctx.stroke();
          } else {
            // Detalhe da maçaneta
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(el.x + el.w - 8, el.y + el.h / 2, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        if (el.type === 'janela') {
          // Renderiza Janela
          ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
          ctx.fillRect(el.x, el.y, el.w, el.h);
          ctx.strokeStyle = isSelected ? '#3b82f6' : '#3b82f6';
          ctx.lineWidth = 2;
          ctx.strokeRect(el.x, el.y, el.w, el.h);

          // Desenha vidros internos
          ctx.beginPath();
          ctx.moveTo(el.x, el.y + el.h / 2);
          ctx.lineTo(el.x + el.w, el.y + el.h / 2);
          ctx.moveTo(el.x + el.w / 2, el.y);
          ctx.lineTo(el.x + el.w / 2, el.y + el.h);
          ctx.stroke();
        }
      });

      // 3. Desenho em Andamento com Cotas em Tempo Real
      if (isDrawing && activeTool === 'rect') {
        const drawW = currentPos.x - startPos.x;
        const drawH = currentPos.y - startPos.y;
        
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(startPos.x, startPos.y, drawW, drawH);
        ctx.setLineDash([]);

        const metersW = (Math.abs(drawW) / 40).toFixed(1);
        const metersH = (Math.abs(drawH) / 40).toFixed(1);

        ctx.fillStyle = '#3b82f6';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        
        // Largura no topo do retângulo
        ctx.fillText(`${metersW}m`, startPos.x + drawW / 2, Math.min(startPos.y, currentPos.y) - 6);
        
        // Altura na lateral do retângulo
        ctx.save();
        ctx.translate(Math.min(startPos.x, currentPos.x) - 10, startPos.y + drawH / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(`${metersH}m`, 0, 0);
        ctx.restore();
      }

    } else if (activeView === '3D') {
      // 3D Isometric Projection
      const isoX = w / 2;
      const isoY = h / 2 + 30;

      const mainWall = elements.find(el => el.type === 'parede') || { x: 200, y: 80, w: 400, h: 160 };
      const dx = mainWall.w * 0.6;
      const dy = mainWall.w * 0.5;
      const dz = mainWall.h * 0.7;

      const project = (x3d, y3d, z3d) => {
        // Centraliza a origem de rotação
        const cx = dx / 2;
        const cy = dy / 2;
        
        // Translada para a origem, rotaciona e translada de volta
        const rx = x3d - cx;
        const ry = y3d - cy;
        
        const cosR = Math.cos(rotationAngle - Math.PI / 6);
        const sinR = Math.sin(rotationAngle - Math.PI / 6);
        
        const rotX = rx * cosR - ry * sinR + cx;
        const rotY = rx * sinR + ry * cosR + cy;

        return {
          x: isoX + (rotX - rotY) * Math.cos(Math.PI / 6),
          y: isoY + (rotX + rotY) * Math.sin(Math.PI / 6) - z3d
        };
      };

      const p0 = project(0, 0, 0);
      const p1 = project(dx, 0, 0);
      const p2 = project(dx, dy, 0);
      const p3 = project(0, dy, 0);

      const p0_z = project(0, 0, dz);
      const p1_z = project(dx, 0, dz);
      const p2_z = project(dx, dy, dz);
      const p3_z = project(0, dy, dz);

      // Piso
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();

      // Parede Esquerda
      ctx.fillStyle = Rates[estrutura].color + '33';
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(p3_z.x, p3_z.y);
      ctx.lineTo(p0_z.x, p0_z.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Parede Direita
      ctx.fillStyle = Rates[estrutura].color + '55';
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p1_z.x, p1_z.y);
      ctx.lineTo(p0_z.x, p0_z.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Linhas frontais estruturais
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p1_z.x, p1_z.y);
      ctx.lineTo(p2_z.x, p2_z.y);
      ctx.lineTo(p3_z.x, p3_z.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(p2_z.x, p2_z.y);
      ctx.stroke();

      // Renderiza Portas e Janelas Projetadas na Parede Direita
      elements.forEach(el => {
        if (el.type === 'porta' || el.type === 'janela') {
          // Razões de posicionamento relativo na parede
          const pctX = (el.x - mainWall.x) / mainWall.w;
          const pctY = (el.y - mainWall.y) / mainWall.h;
          const pctW = el.w / mainWall.w;
          const pctH = el.h / mainWall.h;

          // Conversão para o plano 3D (x3d vai de 0 a dx, z3d vai de 0 a dz)
          const x3d_start = pctX * dx;
          const x3d_end = (pctX + pctW) * dx;
          const z3d_start = (1 - (pctY + pctH)) * dz;
          const z3d_end = (1 - pctY) * dz;

          // Projeta os 4 vértices
          const v0 = project(x3d_start, 0, z3d_start);
          const v1 = project(x3d_end, 0, z3d_start);
          const v2 = project(x3d_end, 0, z3d_end);
          const v3 = project(x3d_start, 0, z3d_end);

          // Desenha o polígono projetado
          ctx.fillStyle = el.type === 'porta' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)';
          ctx.strokeStyle = el.type === 'porta' ? '#ef4444' : '#3b82f6';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(v0.x, v0.y);
          ctx.lineTo(v1.x, v1.y);
          ctx.lineTo(v2.x, v2.y);
          ctx.lineTo(v3.x, v3.y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Detalhes internos da janela em 3D
          if (el.type === 'janela') {
            const v_top_mid = project((x3d_start + x3d_end) / 2, 0, z3d_end);
            const v_bot_mid = project((x3d_start + x3d_end) / 2, 0, z3d_start);
            const v_left_mid = project(x3d_start, 0, (z3d_start + z3d_end) / 2);
            const v_right_mid = project(x3d_end, 0, (z3d_start + z3d_end) / 2);

            ctx.beginPath();
            ctx.moveTo(v_top_mid.x, v_top_mid.y);
            ctx.lineTo(v_bot_mid.x, v_bot_mid.y);
            ctx.moveTo(v_left_mid.x, v_left_mid.y);
            ctx.lineTo(v_right_mid.x, v_right_mid.y);
            ctx.stroke();
          }
        }
      });
    }

    ctx.restore();
  };

  const handleMouseDown = (e) => {
    if (activeView === '3D') {
      setIsRotating3D(true);
      setStartPos({ x: e.clientX, y: e.clientY });
      return;
    }
    if (activeView !== 'Frontal') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.nativeEvent.offsetX * (canvas.width / rect.width)) / zoomScale;
    const y = (e.nativeEvent.offsetY * (canvas.height / rect.height)) / zoomScale;

    // Tenta encontrar se o clique foi em cima de qualquer elemento (somente na ferramenta 'select')
    const clickedElement = activeTool === 'select'
      ? [...elements].reverse().find(el => x >= el.x && x <= el.x + el.w && y >= el.y && y <= el.y + el.h)
      : null;

    if (clickedElement) {
      setSelectedId(clickedElement.id);
      setIsDraggingElement(true);
      setDragOffset({ x: x - clickedElement.x, y: y - clickedElement.y });
    } else {
      setSelectedId(null);
      if (activeTool === 'rect') {
        setIsDrawing(true);
        setStartPos({ x, y });
        setCurrentPos({ x, y });
      } else if (activeTool === 'door' || activeTool === 'window') {
        const newItem = {
          id: Date.now().toString(),
          type: activeTool,
          x: x - 20,
          y: activeTool === 'door' ? y - 40 : y - 20,
          w: activeTool === 'door' ? 40 : 60,
          h: activeTool === 'door' ? 80 : 40
        };
        saveToHistory([...elements, newItem]);
        setSelectedId(newItem.id);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (activeView === '3D' && isRotating3D) {
      const deltaX = e.clientX - startPos.x;
      setRotationAngle(prev => prev + deltaX * 0.015);
      setStartPos({ x: e.clientX, y: e.clientY });
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.nativeEvent.offsetX * (canvas.width / rect.width)) / zoomScale;
    const y = (e.nativeEvent.offsetY * (canvas.height / rect.height)) / zoomScale;

    if (isDraggingElement && selectedId) {
      setElements(elements.map(el => {
        if (el.id === selectedId) {
          return {
            ...el,
            x: x - dragOffset.x,
            y: y - dragOffset.y
          };
        }
        return el;
      }));
    } else if (isDrawing && activeTool === 'rect') {
      setCurrentPos({ x, y });
    }
  };

  const handleMouseUp = () => {
    if (activeView === '3D' && isRotating3D) {
      setIsRotating3D(false);
      return;
    }
    if (isDraggingElement) {
      setIsDraggingElement(false);
      saveToHistory(elements);
    } else if (isDrawing) {
      setIsDrawing(false);
      const w = Math.abs(currentPos.x - startPos.x);
      const h = Math.abs(currentPos.y - startPos.y);

      if (w > 15 && h > 15) {
        const newWall = {
          id: Date.now().toString(),
          type: 'parede',
          x: Math.min(startPos.x, currentPos.x),
          y: Math.min(startPos.y, currentPos.y),
          w,
          h
        };
        const filtered = elements.filter(el => el.type !== 'parede');
        saveToHistory([...filtered, newWall]);
      }
    }
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    saveToHistory(elements.filter(el => el.id !== selectedId));
    setSelectedId(null);
  };

  const currentItemCost = () => {
    // Calcula a área total de portas e janelas (vãos)
    const openingsArea = elements
      .filter(el => el.type === 'porta' || el.type === 'janela')
      .reduce((acc, el) => acc + (el.w / 40) * (el.h / 40), 0);

    const mainWall = elements.find(el => el.type === 'parede');
    const wallAreaGross = mainWall ? (mainWall.w / 40) * (mainWall.h / 40) : (largura * 2.7);
    const wallAreaNet = Math.max(0.5, wallAreaGross - openingsArea);

    // Se for Drywall (divisória de alvenaria/parede), cobra pela metragem da parede líquida (descontando vãos). 
    // Se for PVC ou Gesso (forros de teto), cobra pelo plano horizontal (largura * comprimento).
    const area = estrutura === 'Drywall' ? wallAreaNet : (largura * comprimento);

    const rateCard = Rates[estrutura];
    const rateValue = tipoServico === 'Material + M.O.' ? rateCard.materialLabor : rateCard.laborOnly;
    let cost = area * rateValue;
    if (isolamento) cost += area * 15;
    return cost;
  };

  const handleAddOrUpdateItem = () => {
    const cost = currentItemCost();
    if (editingId) {
      setItems(items.map(item => item.id === editingId ? {
        ...item,
        ambiente,
        estrutura,
        largura,
        comprimento,
        tipoServico,
        isolamento,
        valor: cost
      } : item));
      setEditingId(null);
    } else {
      const newItem = {
        id: Date.now().toString(),
        ambiente,
        estrutura,
        largura,
        comprimento,
        tipoServico,
        isolamento,
        valor: cost
      };
      setItems([...items, newItem]);
    }
    setAmbiente('Outro Quarto/Sala');
  };

  const metragemTotal = items.reduce((acc, item) => acc + (item.largura * item.comprimento), 0);
  const totalEstimado = items.reduce((acc, item) => acc + item.valor, 0);
  const totalItens = items.length;
  const totalMateriais = items.reduce((acc, item) => item.tipoServico === 'Material + M.O.' ? acc + (item.valor * 0.55) : acc, 0);
  const totalMaoDeObra = totalEstimado - totalMateriais;
  const handleWhatsappSend = () => {
    if (items.length === 0) return alert('Adicione pelo menos um item para gerar o orçamento.');

    let text = `Olá *1001 Obra*! Fiz uma simulação de orçamento com planta 2D/3D pelo site:\n\n`;
    items.forEach((item, idx) => {
      const area = item.largura * item.comprimento;
      text += `*${idx + 1}. ${item.ambiente}* - ${item.estrutura}\n`;
      text += `  • Dimensões: ${item.largura}m x ${item.comprimento}m (${area.toFixed(2)} m²)\n`;
      text += `  • Contratação: ${item.tipoServico}${item.isolamento ? ' + Isolamento' : ''}\n`;
      text += `  • Valor Estimado: R$ ${item.valor.toFixed(2)}\n\n`;
    });

    text += `*RESUMO DO ORÇAMENTO:*\n`;
    text += `• Total de Itens: ${totalItens}\n`;
    text += `• Metragem Total: ${metragemTotal.toFixed(2)} m²\n`;
    text += `• Mão de Obra total: R$ ${totalMaoDeObra.toFixed(2)}\n`;
    text += `• Materiais total: R$ ${totalMateriais.toFixed(2)}\n`;
    text += `*VALOR TOTAL ESTIMADO: R$ ${totalEstimado.toFixed(2)}*\n\n`;
    text += `Gostaria de agendar uma visita técnica para validar o projeto!`;

    if (onOpenLeadModal) {
      onOpenLeadModal({
        assunto: `Simulação Orçamento com Planta - ${totalItens} itens`,
        descricao: `Total: R$ ${totalEstimado.toFixed(2)}, metragem: ${metragemTotal.toFixed(2)}m²`,
        calculadoraDados: { items, totalEstimado, metragemTotal },
        whatsappLink: `https://api.whatsapp.com/send?phone=5511965111670&text=${encodeURIComponent(text)}`
      });
    }
  };

  return (
    <div id="calculadora" style={{
      background: 'radial-gradient(circle at 10% 20%, var(--bg-tertiary) 0%, var(--bg-primary) 100%)',
      padding: '50px 0',
      width: '100%'
    }}>
      <div className="container" style={{
        maxWidth: '1280px',
        display: 'grid',
        gridTemplateColumns: '380px 1fr',
        gap: '30px'
      }}>
        
        {/* Formulário Lateral */}
        <div className="glass-card" style={{
          padding: '24px',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          height: 'fit-content'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-color)' }}>Configurar Ambiente</h3>
          
          <div className="form-group">
            <label className="form-label">Produto / Forro</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {['PVC', 'Drywall', 'Gesso'].map((prod) => (
                <button
                  key={prod}
                  type="button"
                  onClick={() => setEstrutura(prod)}
                  style={{
                    padding: '8px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: estrutura === prod ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                    background: estrutura === prod ? 'var(--accent-glow)' : 'transparent',
                    color: estrutura === prod ? 'var(--accent-color)' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {prod}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nome do Ambiente</label>
            <input 
              type="text" 
              className="form-control" 
              value={ambiente}
              onChange={(e) => setAmbiente(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de Serviço</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {['Material + M.O.', 'Só Mão de Obra'].map((tipo) => (
                <button
                  key={tipo}
                  type="button"
                  onClick={() => setTipoServico(tipo)}
                  style={{
                    padding: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: tipoServico === tipo ? '2px solid var(--accent-color)' : '1px solid var(--border-color)',
                    background: tipoServico === tipo ? 'var(--accent-glow)' : 'transparent',
                    color: tipoServico === tipo ? 'var(--accent-color)' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="checkbox" 
              id="iso"
              checked={isolamento} 
              onChange={(e) => setIsolamento(e.target.checked)}
            />
            <label htmlFor="iso" className="form-label" style={{ margin: 0, cursor: 'pointer' }}>Isolamento Acústico</label>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Dimensões:</span>
              <strong>{largura.toFixed(1)}m x {comprimento.toFixed(1)}m</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Valor Estimado:</span>
              <strong style={{ color: 'var(--accent-color)', fontSize: '1.25rem' }}>R$ {currentItemCost().toFixed(2)}</strong>
            </div>
          </div>

          <button 
            type="button" 
            onClick={handleAddOrUpdateItem}
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {editingId ? 'Atualizar Ambiente' : 'Adicionar ao Orçamento'}
          </button>
        </div>

        {/* Quadro de Desenho CAD */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Abas e Comandos do Desenho */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                onClick={() => setActiveView('Frontal')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  background: activeView === 'Frontal' ? 'var(--accent-color)' : 'var(--bg-secondary)',
                  color: activeView === 'Frontal' ? '#000' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Layers size={14} /> Vista Frontal
              </button>
              <button 
                type="button" 
                onClick={() => setActiveView('2D')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  background: activeView === '2D' ? 'var(--accent-color)' : 'var(--bg-secondary)',
                  color: activeView === '2D' ? '#000' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Map size={14} /> Planta (2D)
              </button>
              <button 
                type="button" 
                onClick={() => setActiveView('3D')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  border: 'none',
                  background: activeView === '3D' ? 'var(--accent-color)' : 'var(--bg-secondary)',
                  color: activeView === '3D' ? '#000' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Rotate3d size={14} /> Vista 3D
              </button>
            </div>
          </div>

          {/* Canvas Interativo do Planejador */}
          <div className="glass-card" style={isFullscreen ? {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            background: '#0d1117',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          } : {
            border: '2px solid var(--border-color)',
            borderRadius: '16px',
            overflow: 'hidden',
            background: '#0d1117',
            position: 'relative'
          }}>
            {/* Barra de Ferramentas CAD */}
            {activeView === 'Frontal' && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.8)',
                borderBottom: '1px solid var(--border-color)',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTool('select')}
                    style={{
                      background: activeTool === 'select' ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.1)',
                      color: activeTool === 'select' ? '#000' : '#fff',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Selecionar Parede"
                  >
                    <MousePointer size={14} /> Seleção
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTool('rect')}
                    style={{
                      background: activeTool === 'rect' ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.1)',
                      color: activeTool === 'rect' ? '#000' : '#fff',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Desenhar Parede"
                  >
                    <Square size={14} /> Parede
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const mainWall = elements.find(el => el.type === 'parede') || { x: 200, y: 80, w: 400, h: 160 };
                      const newItem = {
                        id: Date.now().toString(),
                        type: 'porta',
                        x: Math.round(mainWall.x + mainWall.w / 2 - 20),
                        y: Math.round(mainWall.y + mainWall.h - 80),
                        w: 40,
                        h: 80
                      };
                      saveToHistory([...elements, newItem]);
                      setSelectedId(newItem.id);
                      setActiveTool('select');
                    }}
                    style={{
                      background: activeTool === 'door' ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.1)',
                      color: activeTool === 'door' ? '#000' : '#fff',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Adicionar Porta"
                  >
                    <DoorClosed size={14} /> Porta
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const mainWall = elements.find(el => el.type === 'parede') || { x: 200, y: 80, w: 400, h: 160 };
                      const newItem = {
                        id: Date.now().toString(),
                        type: 'janela',
                        x: Math.round(mainWall.x + mainWall.w / 4 - 30),
                        y: Math.round(mainWall.y + mainWall.h / 3),
                        w: 60,
                        h: 40
                      };
                      saveToHistory([...elements, newItem]);
                      setSelectedId(newItem.id);
                      setActiveTool('select');
                    }}
                    style={{
                      background: activeTool === 'window' ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.1)',
                      color: activeTool === 'window' ? '#000' : '#fff',
                      border: 'none',
                      padding: '6px 10px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Adicionar Janela"
                  >
                    <Grid3X3 size={14} /> Janela
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={handleUndo}
                    disabled={history.length === 0}
                    style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    <Undo size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                    style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fff', border: 'none', padding: '6px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    <Redo size={14} />
                  </button>
                  {selectedId && (
                    <button
                      type="button"
                      onClick={handleDeleteSelected}
                      style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} /> Excluir Selecionado
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Painel de Ajuste de Medidas de Elemento Selecionado */}
            {selectedId && elements.find(el => el.id === selectedId) && (
              (() => {
                const selEl = elements.find(el => el.id === selectedId);
                const valW = (selEl.w / 40).toFixed(2);
                const valH = (selEl.h / 40).toFixed(2);
                return (
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.95)',
                    borderBottom: '1px solid var(--border-color)',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    fontSize: '0.85rem'
                  }}>
                    <strong style={{ color: '#f59e0b', textTransform: 'uppercase' }}>
                      ⚙️ Medidas da {selEl.type === 'parede' ? 'Parede' : selEl.type === 'porta' ? 'Porta' : 'Janela'}:
                    </strong>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#9ca3af' }}>Largura (m):</span>
                      <input 
                        type="number"
                        step="0.1"
                        value={valW}
                        onChange={(e) => {
                          const newMeters = parseFloat(e.target.value) || 0.1;
                          setElements(elements.map(el => el.id === selectedId ? { ...el, w: Math.round(newMeters * 40) } : el));
                        }}
                        style={{
                          width: '70px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid #374151',
                          color: '#fff',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '0.8rem'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#9ca3af' }}>Altura (m):</span>
                      <input 
                        type="number"
                        step="0.1"
                        value={valH}
                        onChange={(e) => {
                          const newMeters = parseFloat(e.target.value) || 0.1;
                          setElements(elements.map(el => el.id === selectedId ? { ...el, h: Math.round(newMeters * 40) } : el));
                        }}
                        style={{
                          width: '70px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: '1px solid #374151',
                          color: '#fff',
                          borderRadius: '4px',
                          padding: '2px 6px',
                          fontSize: '0.8rem'
                        }}
                      />
                    </div>
                  </div>
                );
              })()
            )}

            {/* Canvas */}
            <canvas
              ref={canvasRef}
              width={800}
              height={320}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                display: 'block',
                width: '100%',
                height: isFullscreen ? 'calc(100vh - 120px)' : '320px',
                cursor: activeView === 'Frontal' ? 'crosshair' : 'default'
              }}
            />

            {/* Botão de Expandir / Fullscreen (Canto Superior Direito) */}
            <button 
              type="button" 
              onClick={() => setIsFullscreen(!isFullscreen)} 
              style={{
                position: 'absolute',
                top: activeView === 'Frontal' ? '54px' : '12px',
                right: '12px',
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1.5px solid var(--border-color)',
                color: '#fff',
                padding: '8px',
                borderRadius: '6px',
                cursor: 'pointer',
                zIndex: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'auto'
              }}
              title="Tela Cheia"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* Controles de Zoom no Canto Inferior Esquerdo */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              display: 'flex',
              gap: '6px',
              background: 'rgba(0, 0, 0, 0.8)',
              padding: '6px',
              borderRadius: '6px',
              zIndex: 40,
              pointerEvents: 'auto'
            }}>
              <button 
                type="button" 
                onClick={() => setZoomScale(Math.min(2, zoomScale + 0.1))} 
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <ZoomIn size={16} />
              </button>
              <button 
                type="button" 
                onClick={() => setZoomScale(Math.max(0.5, zoomScale - 0.1))} 
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <ZoomOut size={16} />
              </button>
              <button 
                type="button" 
                onClick={() => setZoomScale(1)} 
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          {/* Botões Importar, Salvar e Limpar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <button type="button" onClick={handleSaveDrawing} className="btn-secondary" style={{ padding: '10px' }}>
              📥 Salvar (.drywall)
            </button>
            <button type="button" onClick={() => fileInputRef.current.click()} className="btn-secondary" style={{ padding: '10px' }}>
              📤 Importar Desenho
            </button>
            <button type="button" onClick={handleClearDrawing} className="btn-secondary" style={{ padding: '10px', color: 'var(--danger)' }}>
              🗑️ Limpar Desenho
            </button>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".drywall" onChange={handleImportDrawing} />
          </div>

          {/* Lista de Ambientes no Orçamento */}
          <div className="glass-card" style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontWeight: 800, marginBottom: '12px', fontSize: '0.95rem' }}>Ambientes no Orçamento</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {items.length === 0 ? (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Nenhum ambiente adicionado.</span>
              ) : (
                items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem' }}>
                      <strong>{item.ambiente}</strong> ({item.largura}m x {item.comprimento}m) - {item.estrutura}
                    </span>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <strong style={{ color: 'var(--accent-color)' }}>R$ {item.valor.toFixed(2)}</strong>
                      <button onClick={() => handleEditItem(item)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><Edit size={14} /></button>
                      <button onClick={() => setItems(items.filter(i => i.id !== item.id))} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sumário */}
          <div className="glass-card" style={{
            padding: '20px',
            background: 'var(--bg-tertiary)',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <div>Metragem Total: <strong>{metragemTotal.toFixed(2)} m²</strong></div>
              <div>Mão de Obra: <strong>R$ {totalMaoDeObra.toFixed(2)}</strong></div>
            </div>

            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginRight: '8px' }}>Total Estimado:</span>
                <strong style={{ fontSize: '1.5rem', color: 'var(--accent-color)', fontWeight: 800 }}>R$ {totalEstimado.toFixed(2)}</strong>
              </div>
              <button 
                type="button" 
                onClick={handleWhatsappSend} 
                className="btn-primary"
                style={{ background: '#f59e0b', color: '#000', border: 'none', fontWeight: 700 }}
              >
                Enviar p/ WhatsApp
              </button>
            </div>
          </div>

        </div>

      </div>
      
      <style>{`
        @media (max-width: 900px) {
          #calculadora .container {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Calculator;
