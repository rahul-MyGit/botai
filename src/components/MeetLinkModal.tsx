'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {startMeetBot} from '@/app/actions/meetBot';
// import { startMeetBot, endMeetBot } from '@/actions/meet-bot';

interface MeetLinkModalProps {
  session: any;
}

const MeetLinkModal: React.FC<MeetLinkModalProps> = ({ session }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState('');
  const [botSession, setBotSession] = useState<any>(null);

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
      const result =  await startMeetBot(meetingUrl);

      if (result.success) {
        toast.success('Bot joined meeting successfully');
        setBotSession(result.session);
        setIsOpen(false);
        
        // window.open(meetingUrl, '_blank');
      } else {
        const errorMessage = typeof result.message === 'string' ? result.message : 'Failed to start meet bot';
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error('Failed to start meet bot');
      console.error(error);
    } finally {
      setMeetingUrl('')
    }
  };

  // const handleEndMeeting = async () => {
  //   try {
  //     const result = await endMeetBot();

  //     if (result.success) {
  //       toast.success('Meet bot session ended');
  //       setBotSession(null);
  //     } else {
  //       toast.error(result.message || 'Failed to end meet bot session');
  //     }
  //   } catch (error) {
  //     toast.error('Error ending meet bot session');
  //     console.error(error);
  //   } finally {
  //     setMeetingUrl('');
  //   }
  // };

  return (
    <>
      <div className="flex items-center space-x-4">
        <Button 
          onClick={handleClick} 
          className="text-teal-600 bg-white hover:bg-gray-100 text-base md:text-lg px-8 py-3"
        >
          Try MeetBot Now
        </Button>
        
        {/* {botSession && (
          <Button 
            onClick={handleEndMeeting}
            variant="destructive"
            className="px-8 py-3"
          >
            End Meeting Bot
          </Button>
        )} */}
      </div>

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