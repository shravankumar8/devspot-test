import DevspotLoader from '@/components/common/DevspotLoader';
import React from 'react'

const loading = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-64px)] w-full">
      <DevspotLoader />
    </div>
  );
}

export default loading