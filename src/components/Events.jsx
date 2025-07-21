
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Calendar, Clock, Tag, MapPin, Video, Users, AlertTriangle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Events = ({ addPoints, updateActivity, setActiveTab, user }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('start_time', { ascending: true });

            if (error) {
                console.error('Error fetching events:', error);
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Could not fetch events.',
                });
            } else {
                setEvents(data);
            }
            setLoading(false);
        };
        fetchEvents();
    }, [toast]);

    const getEventTypeStyle = (eventType) => {
        switch (eventType) {
            case 'Yoga Session': return { icon: <Users className="w-4 h-4" />, color: 'bg-emerald-100 text-emerald-800', type: 'yoga' };
            case 'Meditation Session': return { icon: <Video className="w-4 h-4" />, color: 'bg-purple-100 text-purple-800', type: 'meditation' };
            case 'Wellness Workshop': return { icon: <Users className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800', type: 'wellness' };
            case 'Fitness Training': return { icon: <Users className="w-4 h-4" />, color: 'bg-pink-100 text-pink-800', type: 'fitness' };
            default: return { icon: <Tag className="w-4 h-4" />, color: 'bg-gray-100 text-gray-800', type: 'general' };
        }
    };
    
    const handleAttend = async (event) => {
        if (!user) {
            toast({
                variant: "destructive",
                title: "Login Required",
                description: "You must be logged in to attend events.",
            });
            setActiveTab('auth');
            return;
        }

        const style = getEventTypeStyle(event.event_type);
        const activityType = style.type;

        try {
            const { data, error } = await supabase.functions.invoke('award-points', {
                body: { activityType, zoom_url: event.zoom_link },
            });

            if (error) throw error;

            if (data.points) {
                if (addPoints) addPoints(data.points, `Attended ${event.title}`);
                const activityMap = { yoga: 'yogaSessions', fitness: 'fitnessSessions', meditation: 'meditationSessions' };
                const statKey = activityMap[activityType];
                if (statKey && updateActivity) {
                    updateActivity(statKey);
                }
            } else {
                toast({ title: "Heads up!", description: data.message });
            }

        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        }

        window.open(event.zoom_link, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="space-y-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
            >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Upcoming Events
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Discover our schedule of wellness sessions. Join us to relax, recharge, and reconnect.
                </p>
            </motion.div>

            {loading ? (
                <div className="text-center p-8">
                    <p>Loading events...</p>
                </div>
            ) : events.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="harmony-card text-center p-8"
                >
                    <Calendar className="w-12 h-12 mx-auto text-emerald-400 mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-800">No Upcoming Events</h2>
                    <p className="text-gray-600 mt-2">Please check back later for new events and workshops.</p>
                </motion.div>
            ) : (
                <div className="space-y-8">
                    {events.map((event, index) => {
                        const style = getEventTypeStyle(event.event_type);
                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="harmony-card flex flex-col md:flex-row gap-6 p-6"
                            >
                                <div className="md:w-1/4 text-center md:text-left">
                                    <p className="text-3xl font-bold text-emerald-600">{format(new Date(event.start_time), 'dd')}</p>
                                    <p className="text-lg font-semibold text-gray-700">{format(new Date(event.start_time), 'MMM yyyy')}</p>
                                    <p className="text-sm text-gray-500">{format(new Date(event.start_time), 'EEEE')}</p>
                                </div>
                                <div className="md:w-3/4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${style.color}`}>
                                            {style.icon}
                                            {event.event_type || 'General'}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-600 text-sm mb-4">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span>{format(new Date(event.start_time), 'p')}</span>
                                        {event.end_time && <span>&nbsp;– {format(new Date(event.end_time), 'p')}</span>}
                                    </div>
                                    <p className="text-gray-700 mb-4">{event.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            <span>Virtual Event</span>
                                        </div>
                                        {event.zoom_link ? (
                                            user ? (
                                                <Button onClick={() => handleAttend(event)} className="harmony-button">
                                                    <Video className="w-4 h-4 mr-2" />
                                                    Attend
                                                </Button>
                                            ) : (
                                                <Button onClick={() => setActiveTab('auth')} className="harmony-button bg-gray-400 hover:bg-gray-500">
                                                    <LogIn className="w-4 h-4 mr-2" />
                                                    Login to Join
                                                </Button>
                                            )
                                        ) : (
                                            <div className="flex items-center text-sm text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                                                <AlertTriangle className="w-4 h-4 mr-2" />
                                                <span>Link Not Available</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Events;
