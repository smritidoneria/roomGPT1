import { useState, useRef } from 'react';

export default function ResizablePanel({ children }) {
  const [height, setHeight] = useState(null);
  const ref = useRef(null);

  const onResize = () => {
    if (ref.current) {
      setHeight(ref.current.offsetHeight);
    }
  };

  // Trigger onResize initially and on window resize
  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div
      style={{ height }}
      className="relative w-full overflow-hidden"
    >
      <div ref={ref} className={height ? "absolute inset-x-0" : "relative"}>
        {children}
      </div>
    </div>
  );
}
