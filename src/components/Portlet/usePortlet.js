import { useState } from 'react';

export default function usePortlet() {
  const [loading, setLoading] = useState(false);

  /**
   * Reload the content
   */
  const reloadContent = () => {
    setLoading(true);
    setTimeout(
      () => {
        setLoading(false);
      },
      500 + 300 * (Math.random() * 5)
    );
  };

  return [loading, reloadContent];
}
