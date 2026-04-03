"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Pill, 
  Plus, 
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  Heart, 
  Loader2, 
  AlertCircle, 
  Bell, 
  History,
  Sparkles,
  Zap,
  ChevronRight,
  TrendingUp,
  Info
} from "lucide-react";
import { useProtectedUser } from "@/hooks/useProtectedUser";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import Avatar from "@/components/ui/Avatar";

export default function MedicineRemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [todaysSchedule, setTodaysSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [activeTab, setActiveTab] = useState('today'); // today, reminders
  const router = useRouter();
  const { user, loading: autLoading } = useProtectedUser();

  const [formData, setFormData] = useState({
    medicineName: '',
    dosage: '',
    frequency: 'once_daily',
    times: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  });

  const frequencyOptions = [
    { value: 'once_daily', label: 'Once Daily' },
    { value: 'twice_daily', label: 'Twice Daily' },
    { value: 'three_times_daily', label: 'Three Times Daily' },
    { value: 'four_times_daily', label: 'Four Times Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'as_needed', label: 'As Needed' }
  ];

  const loadData = async (userId) => {
    setLoading(true);
    try {
      const [remRes, schedRes] = await Promise.all([
        fetch(`/api/medicine-reminders?userId=${userId}`),
        fetch('/api/medicine-logs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        })
      ]);
      const remData = await remRes.json();
      const schedData = await schedRes.json();
      if (remData.success) setReminders(remData.data);
      if (schedData.success) setTodaysSchedule(schedData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadData(user.id);
  }, [user]);

  const handleFrequencyChange = (frequency) => {
    const defaultTimes = [];
    switch (frequency) {
      case 'once_daily': defaultTimes.push('08:00'); break;
      case 'twice_daily': defaultTimes.push('08:00', '20:00'); break;
      case 'three_times_daily': defaultTimes.push('08:00', '14:00', '20:00'); break;
      case 'four_times_daily': defaultTimes.push('08:00', '12:00', '16:00', '20:00'); break;
      default: defaultTimes.push('08:00'); break;
    }
    setFormData({ ...formData, frequency, times: defaultTimes });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingReminder ? 'PUT' : 'POST';
      const payload = { ...formData, userId: user.id };
      if (editingReminder) payload.reminderId = editingReminder.id;
      
      const response = await fetch('/api/medicine-reminders', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        await loadData(user.id);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      medicineName: '',
      dosage: '',
      frequency: 'once_daily',
      times: ['08:00'],
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      notes: ''
    });
    setShowAddForm(false);
    setEditingReminder(null);
  };

  const updateMedicineStatus = async (item, status) => {
    try {
      const response = await fetch('/api/medicine-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          reminderId: item.reminder.id,
          scheduledTime: item.scheduledTime,
          status: status,
          takenTime: status === 'taken' ? new Date().toISOString() : null
        })
      });
      if (response.ok) await loadData(user.id);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this schedule?')) return;
    try {
      const res = await fetch(`/api/medicine-reminders?reminderId=${id}&userId=${user.id}`, { method: 'DELETE' });
      if (res.ok) await loadData(user.id);
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  if (autLoading || loading) {
    return (
      <div className="space-y-8 animate-pulse pt-4">
        <Skeleton className="h-44 w-full rounded-[2.5rem]" />
        <div className="flex space-x-4">
           <Skeleton className="h-12 w-48 rounded-2xl" />
           <Skeleton className="h-12 w-48 rounded-2xl" />
        </div>
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)}
          </div>
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 to-purple-700 p-8 sm:p-12 text-white shadow-2xl shadow-violet-500/20">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <Badge variant="glass" className="bg-white/20 border-white/30 text-white font-extrabold uppercase tracking-widest text-[10px]">
             Precision Adherence Engine
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight italic">
            Smart Medication <br className="sm:hidden" />
            <span className="text-violet-100">Care Logic</span>
          </h1>
          <p className="text-lg text-violet-50/80 font-medium leading-relaxed">
            Synchronize your treatment schedule with AI-driven adherence tracking and proactive refill alerts.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
             <Button variant="secondary" className="bg-white text-violet-700 hover:bg-violet-50 h-12 px-8 rounded-xl font-extrabold" onClick={() => setShowAddForm(true)} leftIcon={Plus}>
                Schedule Medication
             </Button>
          </div>
        </div>
        <Bell className="absolute right-12 bottom-12 h-32 w-32 text-white/5 opacity-50 rotate-12" />
      </section>

      {/* Tabs & Controls */}
      <div className="flex items-center justify-between">
         <div className="flex p-1.5 bg-gray-100 rounded-2xl space-x-1">
            {['today', 'reminders'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-sm font-extrabold uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white text-primary-600 shadow-sm scale-105" : "text-gray-400 hover:text-gray-600"}`}
              >
                {tab === 'today' ? "Today's Schedule" : "All Medications"}
              </button>
            ))}
         </div>
         <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100 italic">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-bold">
              {todaysSchedule.length > 0
                ? `${Math.round((todaysSchedule.filter(i => i.status === 'taken').length / todaysSchedule.length) * 100)}% Today's Adherence`
                : 'No schedule today'}
            </span>
         </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'today' ? (
            <div className="space-y-4">
               {todaysSchedule.length > 0 ? todaysSchedule.map((item, i) => {
                 const time = new Date(item.scheduledTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                 const isTaken = item.status === 'taken';
                 const isMissed = item.status === 'missed';
                 return (
                   <GlassCard key={i} className={`p-6 border-transparent shadow-xl ring-1 ring-gray-100 group flex items-center justify-between ${isTaken ? "bg-emerald-50/30" : ""}`} hover={!isTaken}>
                      <div className="flex items-center space-x-5">
                         <div className={`h-14 w-14 rounded-2xl flex items-center justify-center p-3 shadow-lg ${isTaken ? "bg-emerald-500 text-white" : isMissed ? "bg-red-500 text-white" : "bg-violet-100 text-violet-600"}`}>
                            <Pill className="h-full w-full" />
                         </div>
                         <div>
                            <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-primary-600 transition-colors">{item.reminder.medicine_name}</h3>
                            <div className="flex items-center space-x-3 mt-1">
                               <Badge variant={isTaken ? "success" : isMissed ? "danger" : "neutral"} className="py-0.5 px-2 text-[9px] uppercase">{item.status}</Badge>
                               <span className="text-xs font-bold text-gray-400 flex items-center"><Clock className="h-3 w-3 mr-1" /> {time}</span>
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                         {item.status === 'pending' && (
                           <>
                             <button onClick={() => updateMedicineStatus(item, 'taken')} className="h-10 w-10 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"><CheckCircle className="h-5 w-5" /></button>
                             <button onClick={() => updateMedicineStatus(item, 'skipped')} className="h-10 w-10 flex items-center justify-center bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"><XCircle className="h-5 w-5" /></button>
                           </>
                         )}
                         {isTaken && <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl"><CheckCircle className="h-5 w-5" /></div>}
                      </div>
                   </GlassCard>
                 );
               }) : (
                 <div className="py-24 bg-white/50 border-2 border-dashed border-gray-200 rounded-[3rem] text-center flex flex-col items-center justify-center space-y-6">
                    <div className="p-6 bg-gray-100 rounded-full"><Clock className="h-12 w-12 text-gray-300" /></div>
                    <h3 className="text-2xl font-extrabold text-gray-900">End of Schedule</h3>
                    <p className="text-gray-500 font-medium max-w-sm italic">You've completed all scheduled doses for today. Stay hydrated!</p>
                 </div>
               )}
            </div>
          ) : (
            <div className="grid gap-6">
               {reminders.map((rem, i) => (
                 <GlassCard key={i} className="p-8 border-transparent shadow-xl ring-1 ring-gray-100 flex items-center justify-between group">
                    <div className="flex items-center space-x-6">
                       <div className="h-16 w-16 rounded-2xl bg-violet-50 text-violet-600 p-4 shadow-lg shadow-violet-500/10 group-hover:scale-110 transition-transform duration-500">
                          <Pill className="h-full w-full" />
                       </div>
                       <div className="space-y-2">
                          <h3 className="text-xl font-extrabold text-gray-900">{rem.medicine_name}</h3>
                          <div className="flex flex-wrap gap-2">
                             <Badge variant="primary" className="bg-violet-50 text-violet-700 border-violet-100 py-0.5 px-2 text-[10px]">{rem.dosage}</Badge>
                             <Badge variant="glass" className="bg-gray-100 text-gray-500 py-0.5 px-2 text-[10px]">{rem.frequency.replace('_', ' ')}</Badge>
                          </div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center"><Clock className="h-3 w-3 mr-1" /> {rem.times.join(' • ')}</p>
                       </div>
                    </div>
                    <div className="flex space-x-2">
                       <button onClick={() => { setEditingReminder(rem); setFormData({ medicineName: rem.medicine_name, dosage: rem.dosage, frequency: rem.frequency, times: rem.times, startDate: rem.start_date, endDate: rem.end_date || '', notes: rem.notes || '' }); setShowAddForm(true); }} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-primary-50 hover:text-primary-600 transition-all"><Edit3 className="h-5 w-5" /></button>
                       <button onClick={() => handleDelete(rem.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="h-5 w-5" /></button>
                    </div>
                 </GlassCard>
               ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
           <GlassCard className="p-8 border-transparent shadow-xl ring-1 ring-gray-100" hover={false}>
              <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-6 px-1">Engagement Dashboard</h3>
              <div className="space-y-6">
                 {[
                   { 
                     label: "Taken Today", 
                     val: todaysSchedule.filter(i => i.status === 'taken').length, 
                     icon: CheckCircle, 
                     color: "text-emerald-500" 
                   },
                   { 
                     label: "Pending Today", 
                     val: todaysSchedule.filter(i => i.status === 'pending').length, 
                     icon: AlertCircle, 
                     color: "text-amber-500" 
                   },
                   { 
                     label: "Active Cycles", 
                     val: reminders.length, 
                     icon: Zap, 
                     color: "text-violet-500" 
                   }
                 ].map((m, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center space-x-3">
                         <m.icon className={`h-5 w-5 ${m.color}`} />
                         <span className="text-sm font-bold text-gray-700">{m.label}</span>
                      </div>
                      <span className={`text-lg font-extrabold ${m.color}`}>{m.val}</span>
                   </div>
                 ))}
              </div>
           </GlassCard>

           <GlassCard className="p-8 bg-violet-900 text-white border-transparent" hover={false}>
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="h-5 w-5 text-violet-300" />
                <span className="font-extrabold uppercase tracking-widest text-[10px]">Smart Tip</span>
              </div>
              <p className="text-sm font-medium text-violet-50/80 leading-relaxed italic">
                "Maintaining a 95%+ adherence rate reduces long-term hospitalization risk by up to 40% based on recent clinical studies."
              </p>
           </GlassCard>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
           <GlassCard className="w-full max-w-2xl p-8 sm:p-12 border-transparent shadow-2xl relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 max-h-[90vh] overflow-y-auto">
              <button onClick={resetForm} className="absolute right-8 top-8 p-2 bg-gray-100 text-gray-400 rounded-xl hover:bg-gray-200 transition-all">
                 <XCircle className="h-6 w-6" />
              </button>
              
              <div className="flex items-center space-x-4 mb-10">
                 <div className="p-4 bg-violet-100 rounded-3xl text-violet-600"><Pill className="h-8 w-8" /></div>
                 <div>
                    <h2 className="text-3xl font-extrabold text-gray-900">{editingReminder ? "Update Schedule" : "New Medication"}</h2>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Clinical Dose Management</p>
                 </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="grid sm:grid-cols-2 gap-8">
                    <Input label="Medicine Name" value={formData.medicineName} onChange={e => setFormData({...formData, medicineName: e.target.value})} placeholder="e.g. Lipitor" required />
                    <Input label="Clinical Dosage" value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} placeholder="e.g. 20mg" required />
                    
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-gray-700 ml-1">Frequency</label>
                       <select value={formData.frequency} onChange={e => handleFrequencyChange(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3.5 px-4 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-medium h-[52px]">
                          {frequencyOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                       </select>
                    </div>
                    
                    <Input label="Start Date" type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                 </div>

                 <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 ml-1">Scheduled Hours</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                       {formData.times.map((t, idx) => (
                         <input key={idx} type="time" value={t} onChange={e => { const newTimes = [...formData.times]; newTimes[idx] = e.target.value; setFormData({...formData, times: newTimes}); }} className="bg-gray-100 border-transparent rounded-xl p-3 text-sm font-bold text-primary-600 focus:ring-2 focus:ring-primary-500" />
                       ))}
                    </div>
                 </div>

                 <div className="pt-6 flex gap-4">
                    <Button type="submit" className="flex-1 h-16 rounded-2xl font-extrabold shadow-xl shadow-primary-500/20" rightIcon={ChevronRight}>
                       {editingReminder ? "Update Program" : "Activate Schedule"}
                    </Button>
                    <Button variant="ghost" type="button" onClick={resetForm} className="px-8 h-16 text-gray-400 font-bold uppercase tracking-widest text-[10px]">Cancel</Button>
                 </div>
              </form>
           </GlassCard>
        </div>
      )}
    </div>
  );
}