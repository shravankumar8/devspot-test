import EmptyPage from '@/components/page-components/dashboard/EmptyPage';
import React from 'react'

const Bounties = () => {
  return (
    <div className="h-[calc(100vh-80px)] py-1 md:px-3">
      <h4 className="font-bold text-[28px]">Bounties</h4>
      <EmptyPage description="Come back soon to view bounties." />
    </div>
  );
}

export default Bounties;