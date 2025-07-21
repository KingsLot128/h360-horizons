
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, UserPlus, Search, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useAdminLogger } from '@/hooks/useAdminLogger';
import Logger from '@/lib/logger';

const AdminUserManager = () => {
    const [users, setUsers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();
    const { logAdminAction } = useAdminLogger();

    const fetchUsersAndCompanies = useCallback(async () => {
        setIsLoading(true);
        Logger.info('Fetching users and companies');
        try {
            const [usersRes, companiesRes] = await Promise.all([
                supabase.from('user_profiles').select('*, company:companies(name)'),
                supabase.from('companies').select('id, name')
            ]);

            if (usersRes.error) throw usersRes.error;
            setUsers(usersRes.data || []);
            Logger.info('Successfully fetched users', { count: usersRes.data.length });

            if (companiesRes.error) throw companiesRes.error;
            setCompanies(companiesRes.data || []);
            Logger.info('Successfully fetched companies', { count: companiesRes.data.length });

        } catch (error) {
            Logger.error('Error fetching users/companies', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch data.' });
        }
        setIsLoading(false);
    }, [toast]);

    useEffect(() => {
        fetchUsersAndCompanies();
    }, [fetchUsersAndCompanies]);

    const handleEditUser = (user) => {
        setEditingUser({ ...user });
    };

    const handleSaveUser = async () => {
        if (!editingUser) return;
        setIsSaving(true);
        const oldValues = users.find(u => u.id === editingUser.id);
        
        const updates = {
            display_name: editingUser.display_name,
            role: editingUser.role,
            company_id: editingUser.company_id,
            is_admin: editingUser.is_admin,
        };

        const { error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', editingUser.id);

        if (error) {
            Logger.error('Error updating user', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to update user.' });
        } else {
            toast({ title: 'Success', description: 'User updated successfully.' });
            await logAdminAction(
                'user_profile_updated',
                `Updated profile for ${editingUser.display_name}`,
                editingUser.user_id,
                { 
                    display_name: oldValues.display_name, 
                    role: oldValues.role, 
                    company_id: oldValues.company_id,
                    is_admin: oldValues.is_admin
                },
                updates
            );
            setEditingUser(null);
            fetchUsersAndCompanies();
        }
        setIsSaving(false);
    };

    const filteredUsers = users.filter(user =>
        (user.display_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="harmony-card p-6">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <div className="flex justify-between items-center mb-4">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Button>
                    <UserPlus className="w-4 h-4 mr-2" /> Add User
                </Button>
            </div>

            {isLoading ? (
                <div className="text-center p-8"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr className="border-b">
                                <th className="p-3 font-semibold">Name</th>
                                <th className="p-3 font-semibold">Company</th>
                                <th className="p-3 font-semibold">Role</th>
                                <th className="p-3 font-semibold">Admin?</th>
                                <th className="p-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="border-b hover:bg-emerald-50/50">
                                    <td className="p-3 font-medium">{user.display_name || 'N/A'}</td>
                                    <td className="p-3">{user.company?.name || 'N/A'}</td>
                                    <td className="p-3">{user.role}</td>
                                    <td className="p-3">{user.is_admin ? 'Yes' : 'No'}</td>
                                    <td className="p-3 text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm" onClick={() => handleEditUser(user)}>
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit User: {editingUser?.display_name}</DialogTitle>
                                                </DialogHeader>
                                                {editingUser && (
                                                    <div className="space-y-4 py-4">
                                                        <div>
                                                            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Display Name</label>
                                                            <Input id="displayName" value={editingUser.display_name} onChange={(e) => setEditingUser({ ...editingUser, display_name: e.target.value })} />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                                                            <Input id="role" value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })} />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                                                            <select id="company" value={editingUser.company_id || ''} onChange={(e) => setEditingUser({ ...editingUser, company_id: e.target.value || null })} className="w-full mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md">
                                                                <option value="">No Company</option>
                                                                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                                            </select>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <input type="checkbox" id="is_admin" checked={editingUser.is_admin} onChange={(e) => setEditingUser({ ...editingUser, is_admin: e.target.checked })} className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                                                            <label htmlFor="is_admin" className="ml-2 block text-sm text-gray-900">Is Admin?</label>
                                                        </div>
                                                    </div>
                                                )}
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DialogClose>
                                                    <Button onClick={handleSaveUser} disabled={isSaving}>
                                                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                                        Save Changes
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminUserManager;
