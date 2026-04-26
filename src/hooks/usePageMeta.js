import { useEffect } from 'react';

const usePageMeta = ({ title, description }) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ArloTechX`;
    }

    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }
  }, [title, description]);
};

export default usePageMeta;
