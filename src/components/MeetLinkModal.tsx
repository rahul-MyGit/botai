'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MeetLinkModalProps {
  session: any;
}

const MeetLinkModal: React.FC<MeetLinkModalProps> = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');

  const handleClick = () => {
    if (!session || !session?.user) {
      toast.error('Please sign in first');
      return;
    }
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session || !session?.user) {
      toast.error('Please sign in first');
      return;
    }

    const urlPattern = /^(https?:\/\/)?(meet\.google\.com\/[a-z0-9-]+)$/i;
    if (!urlPattern.test(meetingUrl)) {
      toast.error('Please enter a valid Google Meet URL');
      return;
    }

    try {
      
      toast.success('Meeting URL submitted successfully');
      setIsOpen(false);
      setMeetingUrl('');
    } catch (error) {
      toast.error('Failed to submit meeting URL');
      console.error(error);
    }
  };

  return (
    <>
      <Button 
        onClick={handleClick} 
        className="text-teal-600 bg-white hover:bg-gray-100 text-base md:text-lg px-8 py-3"
      >
        Try MeetBot Now
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='bg-teal-400'>
          <DialogHeader>
            <DialogTitle className='text-white text-xl'>Enter Google Meet URL</DialogTitle>
          </DialogHeader>
          <DialogDescription className='text-white'>
            Please enter the URL for your Google Meet session below.
          </DialogDescription>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              type="text" 
              placeholder="https://meet.google.com/xxx-xxxx-xxx" 
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              required
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Submit
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MeetLinkModal;