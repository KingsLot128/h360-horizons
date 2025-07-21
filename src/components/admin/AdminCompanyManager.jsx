import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Edit, Trash2, Building, Loader2 } from 'lucide-react';
import Logger from '@/lib/logger';
import { useAdminLogger } from '@/hooks/useAdminLogger';

const AdminCompanyManager = () => {
    const { toast } = useToast();
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCompany, setCurrentCompany] = useState(null);
    const { logAdminAction } = useAdminLogger();
    
    const fetchCompanies = useCallback(async () => {
      setIsLoading(true);
      Logger.info('Fetching companies');
      const { data, error } = await supabase.from('companies').select('*, user_profiles(count)').order('created_at', { ascending: false });
      if(error) {
          Logger.error('Error fetching companies', error);
          toast({ variant: 'destructive', title: 'Error fetching companies' });
      } else {
          Logger.info('Successfully fetched companies', { count: data.length });
          setCompanies(data.map(c => ({...c, seats_used: c.user_profiles[0]?.count || 0})));
      }
      setIsLoading(false);
    }, [toast]);
  
    useEffect(() => { fetchCompanies() }, [fetchCompanies]);
  
    const handleOpenModal = (company = null) => {
        setCurrentCompany(company || { name: '', seats: 10 });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentCompany(null);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      const isUpdate = !!currentCompany.id;
      const actionType = isUpdate ? 'company_update' : 'company_create';
      const description = `${isUpdate ? 'Updated' : 'Created'} company: ${currentCompany.name}`;
      Logger.info(description, { companyId: currentCompany.id });

      const { seats_used, user_profiles, ...payload } = currentCompany;
      const { data, error } = isUpdate
        ? await supabase.from('companies').update(payload).eq('id', currentCompany.id).select().single()
        : await supabase.from('companies').insert(payload).select().single();

      if(error) {
          Logger.error('Error saving company', error);
          toast({ variant: 'destructive', title: 'Error saving company' });
          await logAdminAction(actionType, `${description} - FAILED`, null, isUpdate ? currentCompany : null, payload);
      } else {
        Logger.info('Company saved successfully', { companyId: data.id });
        toast({ title: `Company ${isUpdate ? 'updated' : 'added'}!` });
        await logAdminAction(actionType, description, null, isUpdate ? currentCompany : null, data);
        handleCloseModal();
        fetchCompanies();
      }
      setIsSubmitting(false);
    };
    
    return (
        <div className="harmony-card p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center"><Building className="w-6 h-6 mr-2 text-cyan-600" /> Company Management</h2>
                <Button onClick={() => handleOpenModal()} className="harmony-button flex items-center gap-2"><PlusCircle className="w-5 h-5" /> Add Company</Button>
            </div>
            {isLoading ? <div className="text-center p-8"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
                : <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead><tr className="border-b"><th className="p-3">Name</th><th className="p-3">Seats</th><th className="p-3">Actions</th></tr></thead>
                      <tbody>
                        {companies.map(c => <tr key={c.id} className="border-b hover:bg-cyan-50/50">
                          <td className="p-3 font-medium">{c.name}</td>
                          <td className="p-3">{c.seats_used} / {c.seats}</td>
                          <td className="p-3 flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => handleOpenModal(c)}><Edit className="w-4 h-4" /></Button>
                            <Button variant="destructive" size="icon"><Trash2 className="w-4 h-4" /></Button>
                          </td>
                        </tr>)}
                      </tbody>
                    </table>
                </div>}

            {isModalOpen && currentCompany && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={handleCloseModal}>
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white rounded-lg shadow-xl w-full max-w-md p-8" onClick={e => e.stopPropagation()}>
                    <h2 className="text-2xl font-bold mb-6">{currentCompany.id ? 'Edit Company' : 'Add New Company'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input placeholder="Company Name" value={currentCompany.name} onChange={e => setCurrentCompany({...currentCompany, name: e.target.value})} required />
                        <div>
                            <label className="text-sm font-medium">Seats</label>
                            <Input type="number" placeholder="Number of seats" value={currentCompany.seats} onChange={e => setCurrentCompany({...currentCompany, seats: parseInt(e.target.value, 10)})} required />
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={handleCloseModal} disabled={isSubmitting}>Cancel</Button>
                            <Button type="submit" className="harmony-button" disabled={isSubmitting}>{isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />} {currentCompany.id ? 'Update' : 'Add'}</Button>
                        </div>
                    </form>
                </motion.div>
            </div>}
        </div>
    );
};

export default AdminCompanyManager;