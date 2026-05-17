"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowLeft,
  Heart,
  Loader2,
  AlertCircle,
  Info,
  Send,
  History,
  TrendingUp,
  Sparkles,
  Activity,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import Button from "@/components/ui/Button";
import GlassCard from "@/components/ui/GlassCard";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import { useProtectedProfile } from "@/hooks/useProtectedProfile";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";

export default function SymptomCheckerPage() {
  const router = useRouter();
  const { user, profile, loading: profileLoading } = useProtectedProfile();
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const historyScrollRef = React.useRef(null);
  const isScrollingRef = React.useRef(false);
  const scrollTimeoutRef = React.useRef(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Symptom Chat States
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const chatBottomRef = React.useRef(null);

  const fetchHistory = React.useCallback(async (reset = true) => {
    if (!user) return;
    
    if (reset) {
      setPage(0);
      setHistory([]);
    } else {
      setLoadingMore(true);
    }

    try {
      const currentPage = reset ? 0 : page;
      const params = new URLSearchParams({
        limit: '5',
        offset: (currentPage * 5).toString(),
      });
      const response = await fetch(`/api/symptom-checker?${params}`);
      const data = await response.json();
      if (data.success) {
        if (reset) {
          setHistory(data.data);
          setHasMore(data.hasMore);
        } else {
          setHistory(prev => [...prev, ...data.data]);
          setHasMore(data.hasMore);
          setPage(currentPage + 1);
        }
      }
    } catch (error) {
      // Error fetching history - will show empty state
    } finally {
      if (!reset) {
        setLoadingMore(false);
      }
    }
  }, [user, page, setPage, setHistory, setHasMore, setLoadingMore]);

  useEffect(() => {
    fetchHistory(true);
  }, [user]);

  const loadMore = React.useCallback(() => {
    if (!loadingMore && hasMore && user && !isScrollingRef.current) {
      isScrollingRef.current = true;
      fetchHistory(false);
    }
  }, [loadingMore, hasMore, user, fetchHistory]);

  // Scroll detection on the history container
  useEffect(() => {
    const container = historyScrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      // Don't trigger if we just programmatically scrolled
      if (container.dataset.isProgrammaticScroll === 'true') {
        return;
      }
      
      // Trigger loadMore when scrolled to 90% of the container
      if (scrollTop + clientHeight >= scrollHeight * 0.9 && !loadingMore && hasMore && !isScrollingRef.current) {
        // Clear any existing timeout
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        
        // Debounce the loadMore call
        scrollTimeoutRef.current = setTimeout(() => {
          loadMore();
        }, 500);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [loadingMore, hasMore, loadMore]);

  // Scroll to bottom after loading more content
  useEffect(() => {
    const container = historyScrollRef.current;
    if (!container || !isScrollingRef.current) return;

    // Only run when loadingMore transitions from true to false
    if (!loadingMore && isScrollingRef.current) {
      requestAnimationFrame(() => {
        if (container) {
          // Mark as programmatic scroll to prevent triggering loadMore again
          container.dataset.isProgrammaticScroll = 'true';
          container.scrollTop = container.scrollHeight;
          isScrollingRef.current = false;
          
          // Reset the flag after a short delay
          setTimeout(() => {
            if (container) {
              delete container.dataset.isProgrammaticScroll;
            }
          }, 100);
        }
      });
    }
  }, [loadingMore]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim() || !user) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch("/api/symptom-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptoms.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({ ...data.data, id: data.checkId });
        fetchHistory(); // Refresh history
      } else {
        toast.error('Analysis Failed', {
          description: data.error || "Failed to analyze symptoms"
        });
      }
    } catch (error) {
      toast.error('Analysis Failed', {
        description: "Analysis failed. Please try again."
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Symptom Chat Handlers and Hooks
  const handleOpenChat = (checkId, symptomsText, initialAnalysis) => {
    if (!checkId) {
      toast.error("Unable to open chat", {
        description: "Symptom check ID is missing. Please refresh and try again."
      });
      return;
    }

    // Look up if this item already has a chat history in the database (stored inside ai_response)
    const matchedItem = history.find(item => item.id === checkId) || (result && result.id === checkId ? { ai_response: result } : null);
    const existingHistory = matchedItem?.ai_response?.chat_history || [];

    setActiveChatId(checkId);
    
    if (existingHistory.length > 0) {
      setChatMessages(existingHistory);
    } else {
      // Pre-populate with a warm welcome message
      setChatMessages([
        {
          role: "assistant",
          content: `Hi! I am your HealthBuddy AI Assistant. I've reviewed your symptoms description: *"${symptomsText}"* and the analysis findings.\n\nHow can I help you understand these possible conditions, immediate actions, or emergency red flags? Please feel free to ask me any questions!`
        }
      ]);
    }
    
    setShowChatModal(true);
    // Automatically close the details modal if it was open
    setShowDetailsModal(false);
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading || !activeChatId) return;

    const userMsg = { role: "user", content: chatInput.trim() };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const response = await fetch("/api/symptom-checker/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkId: activeChatId,
          message: userMsg.content
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setChatMessages(prev => [...prev, data.data]);
        
        // Update this check's history item client-side to persist the chat history instantly!
        setHistory(prev => prev.map(item => {
          if (item.id === activeChatId) {
            return {
              ...item,
              ai_response: {
                ...item.ai_response,
                chat_history: data.history
              }
            };
          }
          return item;
        }));
      } else {
        toast.error("Chat Error", {
          description: data.error || "Failed to send message to AI"
        });
      }
    } catch (error) {
      toast.error("Chat Error", {
        description: "Failed to connect to the server."
      });
    } finally {
      setChatLoading(false);
    }
  };

  // Scroll to bottom on new chat messages
  useEffect(() => {
    if (showChatModal) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatLoading, showChatModal]);

  const getSeverityVariant = (severity) => {
    switch (severity?.toLowerCase()) {
      case "low": return "success";
      case "medium": return "warning";
      case "high": return "danger";
      case "emergency": return "danger";
      default: return "neutral";
    }
  };

  const handleViewDetails = (historyItem) => {
    setSelectedHistoryItem(historyItem);
    setShowDetailsModal(true);
  };

  if (profileLoading) {
    return (
      <div className="space-y-8 animate-pulse pt-4">
        <Skeleton className="h-44 w-full rounded-3xl" />
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <Skeleton className="h-screen w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-20">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-violet-600 to-purple-700 p-5 sm:p-12 text-white shadow-2xl shadow-violet-500/20">
        <div className="relative z-10 space-y-4 max-w-2xl">
          <Badge variant="glass" className="bg-white/20 border-white/30 text-white">
            <Sparkles className="h-3.5 w-3.5 mr-2" />
            Medical Grade AI Analysis
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight italic">
            AI Symptom <br className="sm:hidden" />
            <span className="text-violet-100">Checker</span>
          </h1>
          <p className="text-lg text-violet-50/80 font-medium leading-relaxed">
            Describe your concerns and get instant medical-grade insights powered by advanced AI.
          </p>
        </div>
        <Stethoscope className="absolute right-12 bottom-12 h-32 w-32 text-white/5 opacity-50 rotate-12" />
      </section>

      {/* Disclaimer */}
      <GlassCard className="bg-amber-50 border-amber-100 p-6 flex items-start space-x-4 border-l-8 border-l-amber-400" hover={false}>
        <div className="p-3 bg-amber-400 rounded-xl text-white">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-amber-900 leading-none mb-1">Medical Disclaimer</h3>
          <p className="text-amber-800/80 text-sm font-bold">
            This tool provides information only and is NOT a substitute for professional medical advice, diagnosis, or treatment. 
            <span className="text-amber-900 ml-1">In case of emergency, call 102 immediately.</span>
          </p>
        </div>
      </GlassCard>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Form */}
          <GlassCard className="p-4 sm:p-10 border-transparent shadow-xl ring-1 ring-gray-100">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center">
              <Activity className="h-6 w-6 mr-3 text-violet-600" />
              Describe Symptoms
            </h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-extrabold text-gray-500 uppercase tracking-widest pl-1">
                  DETAILED DESCRIPTION
                </label>
                <textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms in detail (e.g., fever, headache, fatigue, cough)"
                  className="w-full bg-white border border-gray-200 rounded-xl p-6 min-h-45 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500 outline-none transition-all resize-none font-medium text-gray-700"
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full h-16 rounded-xl text-lg font-extrabold"
                isLoading={isAnalyzing}
                leftIcon={isAnalyzing ? null : Send}
              >
                {isAnalyzing ? "Processing Analysis..." : "Analyze Symptoms Now"}
              </Button>
            </form>
          </GlassCard>

          {/* Analysis Results Display */}
          {result && (
            <GlassCard className="p-4 sm:p-10 border-transparent shadow-2xl animate-in fade-in slide-in-from-top-8 duration-700">
               <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                  <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-extrabold text-gray-900">Analysis Insights</h3>
                    <Button 
                      variant="primary" 
                      size="sm" 
                      onClick={() => handleOpenChat(result.id, symptoms, result)}
                      leftIcon={MessageSquare}
                      className="h-10 rounded-xl px-4 text-xs font-extrabold shadow-md shadow-primary-500/10 animate-pulse"
                    >
                      Chat with AI
                    </Button>
                  </div>
                  <Badge variant={getSeverityVariant(result.severity)} className="py-2 px-5 text-sm uppercase tracking-wider font-extrabold">
                     {result.severity} Priority
                  </Badge>
               </div>

               <div className="space-y-12">
                  {/* Possible Conditions */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest">POSSIBLE CONDITIONS</h4>
                      <div className="space-y-3">
                        {result.possibleConditions?.map((c, i) => (
                          <div key={i} className="flex items-start space-x-3 p-4 bg-gray-50/80 rounded-2xl border border-gray-100 group hover:bg-white hover:border-primary-200 transition-colors">
                            <Info className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" />
                            <span className="font-bold text-gray-800 leading-tight group-hover:text-primary-700">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest">IMMEDIATE ACTIONS</h4>
                      <div className="space-y-3">
                        {result.recommendations?.immediate?.map((a, i) => (
                          <div key={i} className="flex items-start space-x-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 uppercase text-[10px] sm:text-xs font-extrabold tracking-tight">
                            <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                            <span className="text-emerald-800 mt-1">{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-100" />

                  {/* Warning Signs */}
                  <div className="space-y-4">
                      <h4 className="text-sm font-extrabold text-red-400 uppercase tracking-widest">EMERGENCY RED FLAGS</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {result.warningSigns?.map((s, i) => (
                          <div key={i} className="flex items-center space-x-3 p-4 bg-red-50/80 rounded-2xl border border-red-100 text-red-900 font-bold">
                            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                  </div>

                  {/* Disclaimer Text */}
                  <div className="p-4 bg-gray-50 rounded-2xl text-[10px] sm:text-xs font-bold text-gray-400 text-center uppercase tracking-widest leading-loose italic">
                    {result.disclaimer}
                  </div>
               </div>
            </GlassCard>
          )}
        </div>

        {/* Sidebar: History & Tips */}
        <div className="space-y-10">
          <h2 className="text-2xl font-extrabold text-gray-900 px-2">History</h2>
          <div ref={historyScrollRef} className="h-[500px] overflow-y-auto hide-scrollbar space-y-6">
            {history.length > 0 ? (
              <>
                {history.map((check, i) => {
                  const checkDate = new Date(check.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
                  return (
                    <GlassCard key={i} className="p-6 border-transparent bg-gray-50/50 hover:bg-white group cursor-pointer transition-all duration-300" onClick={() => handleViewDetails(check)}>
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant={getSeverityVariant(check.severity_level)} className="text-[10px] px-2.5">{check.severity_level}</Badge>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{checkDate}</span>
                      </div>
                      <p className="text-sm font-bold text-gray-700 line-clamp-2 italic mb-3">&quot;{check.symptoms_description}&quot;</p>
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100/50">
                        <div 
                          className="flex items-center text-primary-500 text-[11px] font-extrabold uppercase tracking-widest group-hover:translate-x-1 transition-transform"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(check);
                          }}
                        >
                          VIEW DETAILS <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenChat(check.id, check.symptoms_description, check.ai_response);
                          }}
                          className="flex items-center space-x-1 text-violet-600 hover:text-violet-800 text-[11px] font-extrabold uppercase tracking-widest transition-colors"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>CHAT WITH AI</span>
                        </button>
                      </div>
                    </GlassCard>
                  );
                })}
                
                {/* Loading Indicator */}
                {loadingMore && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-primary-600 mr-2" />
                    <span className="text-xs font-bold text-gray-500">Loading more...</span>
                  </div>
                )}

                {!hasMore && history.length > 0 && (
                  <div className="text-center py-2">
                    <p className="text-xs font-bold text-gray-400">Showing all {history.length} reports</p>
                  </div>
                )}
              </>
            ) : (
              <div className="p-10 text-center space-y-4">
                <div className="p-4 bg-gray-50 rounded-3xl inline-block mx-auto">
                  <History className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">No Recent Reports Found</p>
              </div>
            )}
          </div>

          <div className="pt-4">
            <GlassCard className="p-8 bg-primary-600 text-white border-transparent">
              <div className="flex items-center space-x-3 mb-4">
                <Sparkles className="h-5 w-5 text-primary-200" />
                <h3 className="font-extrabold text-lg uppercase tracking-widest text-[10px]">AI Insight</h3>
              </div>
              <p className="text-sm font-medium text-primary-50/80 leading-relaxed italic">
                {history.length > 0 
                  ? `You've checked ${history.length} reports recently. Be specific about symptoms for the most accurate AI guidance.` 
                  : "Welcome! Describe your symptoms clearly, including duration and intensity, for the most accurate analysis."}
              </p>
            </GlassCard>
          </div>
        </div>

        {/* History Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Symptom Check Details"
          size="xl"
          showCloseButton={true}
        >
          {selectedHistoryItem && (
            <div className="text-left space-y-6 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-1">
                    CHECKED ON
                  </p>
                  <p className="text-sm font-bold text-gray-700">
                    {new Date(selectedHistoryItem.timestamp).toLocaleString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => handleOpenChat(selectedHistoryItem.id, selectedHistoryItem.symptoms_description, selectedHistoryItem.ai_response)}
                    leftIcon={MessageSquare}
                    className="h-10 rounded-xl px-4 text-xs font-extrabold shadow-md shadow-primary-500/10 animate-pulse"
                  >
                    Chat with AI
                  </Button>
                  <Badge variant={getSeverityVariant(selectedHistoryItem.severity_level)} className="py-2 px-4 text-sm uppercase tracking-wider font-extrabold">
                    {selectedHistoryItem.severity_level} Priority
                  </Badge>
                </div>
              </div>

              <hr className="border-gray-200" />

              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest">SYMPTOMS DESCRIBED</h4>
                <p className="text-base font-bold text-gray-800 leading-relaxed italic bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  "{selectedHistoryItem.symptoms_description}"
                </p>
              </div>

              {selectedHistoryItem.ai_response && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest">POSSIBLE CONDITIONS</h4>
                      <div className="space-y-2">
                        {selectedHistoryItem.ai_response.possibleConditions?.map((c, i) => (
                          <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50/80 rounded-xl border border-gray-100">
                            <Info className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
                            <span className="font-bold text-gray-800 text-sm leading-tight">{c}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-extrabold text-gray-400 uppercase tracking-widest">IMMEDIATE ACTIONS</h4>
                      <div className="space-y-2">
                        {selectedHistoryItem.ai_response.recommendations?.immediate?.map((a, i) => (
                          <div key={i} className="flex items-start space-x-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-[11px] font-extrabold tracking-tight uppercase">
                            <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span className="text-emerald-800 mt-0.5">{a}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="space-y-3">
                    <h4 className="text-sm font-extrabold text-red-400 uppercase tracking-widest">EMERGENCY RED FLAGS</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedHistoryItem.ai_response.warningSigns?.map((s, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 bg-red-50/80 rounded-xl border border-red-100 text-red-900 font-bold text-sm">
                          <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                          <span>{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl text-[10px] font-bold text-gray-400 text-center uppercase tracking-widest leading-relaxed italic">
                    {selectedHistoryItem.ai_response.disclaimer}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Symptom Chat Modal */}
        <Modal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          title="Symptom Chat Assistant"
          size="lg"
          showCloseButton={true}
        >
          <div className="flex flex-col h-[550px]">
            {/* Disclaimer Info */}
            <div className="p-3 bg-violet-50 text-violet-800 text-[10px] sm:text-xs font-bold rounded-xl flex items-center space-x-2 shrink-0 mb-4 border border-violet-100">
              <Sparkles className="h-4 w-4 shrink-0 text-violet-500" />
              <span>Ask follow-up questions about your symptom analysis. This is AI-generated and not a doctor's diagnosis.</span>
            </div>

            {/* Chat Messages scroll area */}
            <div className="flex-1 overflow-y-auto px-1 space-y-4 mb-4 hide-scrollbar">
              {chatMessages.map((msg, idx) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={idx}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed shadow-sm ${
                        isUser
                          ? "bg-violet-600 text-white rounded-br-none"
                          : "bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200/50"
                      }`}
                    >
                      {isUser ? (
                        <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                      ) : (
                        <div className="space-y-1">{renderFormattedMessage(msg.content)}</div>
                      )}
                    </div>
                  </div>
                );
              })}
              {chatLoading && (
                <div className="flex justify-start items-center space-x-2 py-2">
                  <div className="bg-slate-100 text-slate-500 rounded-2xl rounded-bl-none px-4 py-3 text-sm font-bold flex items-center border border-slate-200/50">
                    <Loader2 className="h-4 w-4 animate-spin mr-2 text-violet-500" />
                    Assistant is typing...
                  </div>
                </div>
              )}
              {/* Dummy element to scroll to */}
              <div ref={chatBottomRef} />
            </div>

            {/* Input typing area */}
            <form onSubmit={handleSendChatMessage} className="flex items-center space-x-3 pt-3 border-t border-slate-100 shrink-0">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask a follow-up question..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all"
                disabled={chatLoading}
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="h-11 w-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-violet-500/20 active:scale-95 disabled:opacity-50 transition-all duration-200"
              >
                <Send className="h-5 w-5 text-white" />
              </button>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
}

// Markdown-to-React formatting helpers for AI chat responses
const renderFormattedMessage = (content) => {
  if (!content) return null;

  // Split into paragraphs/lines
  const lines = content.split('\n');
  
  return lines.map((line, lineIdx) => {
    let trimmedLine = line.trim();

    // 1. Headers (### Header)
    if (trimmedLine.startsWith('###')) {
      const text = trimmedLine.replace(/^###\s*/, '');
      return (
        <h4 key={lineIdx} className="text-sm font-extrabold text-slate-900 mt-3 mb-1.5 flex items-center">
          {parseInlineMarkdown(text)}
        </h4>
      );
    }
    if (trimmedLine.startsWith('##')) {
      const text = trimmedLine.replace(/^##\s*/, '');
      return (
        <h3 key={lineIdx} className="text-base font-extrabold text-slate-900 mt-4 mb-2 flex items-center">
          {parseInlineMarkdown(text)}
        </h3>
      );
    }

    // 2. Lists: Bullet list (* or -) or numbered list (1.)
    const bulletMatch = line.match(/^(\s*)[*\-]\s+(.*)/);
    if (bulletMatch) {
      const text = bulletMatch[2];
      return (
        <div key={lineIdx} className="flex items-start space-x-2 my-1 pl-2">
          <span className="text-violet-500 shrink-0 mt-1.5 text-[10px]">•</span>
          <span className="text-sm text-slate-800 leading-relaxed font-semibold">
            {parseInlineMarkdown(text)}
          </span>
        </div>
      );
    }

    const numberMatch = line.match(/^(\s*)\d+\.\s+(.*)/);
    if (numberMatch) {
      const text = numberMatch[2];
      return (
        <div key={lineIdx} className="flex items-start space-x-2 my-1 pl-2">
          <span className="text-violet-600 font-extrabold shrink-0 mt-0.5 text-xs">
            {line.match(/^\s*(\d+)\./)[1]}.
          </span>
          <span className="text-sm text-slate-800 leading-relaxed font-semibold">
            {parseInlineMarkdown(text)}
          </span>
        </div>
      );
    }

    // 3. Regular paragraph
    if (trimmedLine === '') {
      return <div key={lineIdx} className="h-1.5" />;
    }

    return (
      <p key={lineIdx} className="text-sm leading-relaxed mb-1.5 font-semibold text-slate-800">
        {parseInlineMarkdown(line)}
      </p>
    );
  });
};

// Inline parser for bold and italic
const parseInlineMarkdown = (text) => {
  if (!text) return "";

  const parts = [];
  let currentIdx = 0;

  // Regex to match **bold** or *italic*
  const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const matchIdx = match.index;
    
    // Add plain text before match
    if (matchIdx > currentIdx) {
      parts.push(text.substring(currentIdx, matchIdx));
    }

    if (match[2]) {
      // Bold match
      parts.push(<strong key={matchIdx} className="font-extrabold text-slate-900">{match[2]}</strong>);
    } else if (match[4]) {
      // Italic match
      parts.push(<em key={matchIdx} className="italic text-slate-700">{match[4]}</em>);
    }

    currentIdx = regex.lastIndex;
  }

  if (currentIdx < text.length) {
    parts.push(text.substring(currentIdx));
  }

  return parts.length > 0 ? parts : text;
};
