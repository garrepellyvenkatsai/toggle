import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const MermaidDiagram = ({ code }) => {
  const diagramRef = useRef(null);

  useEffect(() => {
    if (code) {
      diagramRef.current.innerHTML = `<div class="mermaid">${code}</div>`;
      mermaid.initialize({ startOnLoad: true });
      mermaid.contentLoaded();
    }
  }, [code]);

  return <div ref={diagramRef} className="diagramContainer"></div>;
};

export default MermaidDiagram;
