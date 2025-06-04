import { useEffect, useState } from 'react';
import Confetti from 'react-dom-confetti';

const ConfettiConfig = {
  angle: 90,
  spread: 1000,
  startVelocity: 20,
  elementCount: 1000,
  dragFriction: 0.12,
  duration: 3000,
  stagger: 3,
  width: '10px',
  height: '10px',
  perspective: '500px',
  colors: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
};

const ConfettiAnimation = ({ allTasksDone }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (allTasksDone) {
      setActive(true);
      const timer = setTimeout(() => setActive(false), 100);
      return () => clearTimeout(timer);
    }
  }, [allTasksDone]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
      }}
    >
      <Confetti active={active} config={ConfettiConfig} />
    </div>
  );
};

export default ConfettiAnimation;
