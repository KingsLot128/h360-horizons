import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Edit, Trash2, Calendar, Loader2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import Logger from '@/lib/logger';
import { useAdminLogger } from '@/hooks/useAdminLogger';

const AdminEventManager = ({ events, fetchEvents, toast }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState(null);
    const { logAdminAction } = useAdminLogger();

    const eventTypes = ["Yoga Session", "Meditation Session", "Wellness Workshop", "Fitness Training", "Zen Elite Workshop"];
    const zoomLinks = {
        "Yoga Session": "https://us06web.zoom.us/j/87333490636?pwd=bVg4K1djVy9RcmhZa3BTZVpOYmpaQT09",
        "Meditation Session": "https://us06web.zoom.us/j/84108324290?pwd=7X6YgjNs5lSnqG5aSjrMYnkbfNEein.1",
        "Wellness Workshop": "https://us06web.zoom.us/j/82958595941?pwd=oGndXdgaOea40UuBAphsRBtDeqFwMc.1",
        "Fitness Training": "https://us06web.zoom.us/j/859751937059",
        "Zen Elite Workshop": "https://us06web.zoom.us/j/82958595941?pwd=oGndXdgaOea40UuBAphsRBtDeqFwMc.1"
    };

    const handleOpenModal = (event = null) => {
        const defaultEventType = eventTypes[0];
        const eventData = event ? {
            ...event,
            start_time: format(parseISO(event.start_time), "yyyy-MM-dd'T'HH:mm"),
            end_time: event.end_time ? format(parseISO(event.end_time), "yyyy-MM-dd'T'HH:mm") : '',
        } : {
            title: '', description: '', event_type: defaultEventType, zoom_link: zoomLinks[defaultEventType], start_time: '', end_time: ''
        };
        setCurrentEvent(eventData);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => { setIsModalOpen(false); setCurrentEvent(null); };
    const handleChange = (e) => setCurrentEvent(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleEventTypeChange = (e) => {
        const eventType = e.target.value;
        setCurrentEvent(prev => ({ ...prev, event_type: eventType, zoom_link: zoomLinks[eventType] || '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const isUpdate = !!currentEvent.id;
        const actionType = isUpdate ? 'event_update' : 'event_create';
        const description = `${isUpdate ? 'Updated' : 'Created'} event: ${currentEvent.title}`;
        Logger.info(description, { eventId: currentEvent.id });

        const { id, created_at, updated_at, ...eventData } = currentEvent;
        const payload = { ...eventData, end_time: eventData.end_time || null };
        
        const { data, error } = isUpdate
            ? await supabase.from('events').update(payload).eq('id', currentEvent.id).select().single()
            : await supabase.from('events').insert(payload).select().single();

        if (error) {
            Logger.error('Failed to save event', error);
            toast({ variant: 'destructive', title: 'Error', description: `Failed to save event: ${error.message}` });
            await logAdminAction(actionType, `${description} - FAILED`, null, isUpdate ? currentEvent : null, payload);
        } else {
            Logger.info('Event saved successfully', { eventId: data.id });
            toast({ title: 'Success', description: `Event ${isUpdate ? 'updated' : 'created'} successfully.` });
            await logAdminAction(actionType, description, null, isUpdate ? currentEvent : null, data);
            handleCloseModal();
            fetchEvents();
        }
        setIsSubmitting(false);
    };

    const handleDelete = async (event) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        Logger.info('Deleting event', { eventId: event.id });
        const { error } = await supabase.from('events').delete().eq('id', event.id);
        if (error) {
            Logger.error('Failed to delete event', error);
            toast({ variant: 'destructive', title: 'Error', description: `Failed to delete event: ${error.message}` });
            await logAdminAction('event_delete', `Attempted to delete event: ${event.title} - FAILED`, null, event, null);
        } else {
            Logger.info('Event deleted successfully', { eventId: event.id });
            toast({ title: 'Success', description: 'Event deleted successfully.' });
            await logAdminAction('event_delete', `Deleted event: ${event.title}`, null, event, null);
            fetchEvents();
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center"><Calendar className="w-6 h-6 mr-2 text-emerald-600" /> Event Management</h2>
                <Button onClick={() => handleOpenModal()} className="harmony-button flex items-center gap-2"><PlusCircle className="w-5 h-5" /> Create</Button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead><tr className="border-b"><th className="p-3">Title</th><th className="p-3">Start Time</th><th className="p-3">Actions</th></tr></thead>
                    <tbody>
                        {events.slice(0, 5).map(event => (
                            <tr key={event.id} className="border-b hover:bg-emerald-50/50">
                                <td className="p-3 font-medium">{event.title}</td>
                                <td className="p-3">{format(new Date(event.start_time), 'PPp')}</td>
                                <td className="p-3 flex gap-2">
                                    <Button variant="outline" size="icon" onClick={() => handleOpenModal(event)}><Edit className="w-4 h-4" /></Button>
                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(event)}><Trash2 className="w-4 h-4" /></Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={handleCloseModal}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-8" onClick={e => e.stopPropagation()}>
                    <h2 className="text-2xl font-bold mb-6">{currentEvent.id ? 'Edit Event' : 'Create New Event'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input name="title" value={currentEvent.title} onChange={handleChange} placeholder="Event Title" required />
                        <Textarea name="description" value={currentEvent.description} onChange={handleChange} placeholder="Event Description" />
                        <div><label className="text-sm font-medium">Event Type</label><select name="event_type" value={currentEvent.event_type} onChange={handleEventTypeChange} className="w-full p-2 border rounded-md mt-1">{eventTypes.map(type => <option key={type} value={type}>{type}</option>)}</select></div>
                        <Input name="zoom_link" value={currentEvent.zoom_link} onChange={handleChange} placeholder="Zoom Link" required />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium">Start Time</label><Input type="datetime-local" name="start_time" value={currentEvent.start_time} onChange={handleChange} required /></div><div><label className="text-sm font-medium">End Time (Optional)</label><Input type="datetime-local" name="end_time" value={currentEvent.end_time} onChange={handleChange} /></div></div>
                        <div className="flex justify-end gap-4 pt-4"><Button type="button" variant="outline" onClick={handleCloseModal} disabled={isSubmitting}>Cancel</Button><Button type="submit" className="harmony-button" disabled={isSubmitting}>{isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}{currentEvent.id ? 'Update Event' : 'Create Event'}</Button></div>
                    </form>
                </motion.div>
            </div>}
        </>
    );
};

export default AdminEventManager;