import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatIcon from "./ChatIcon";
import { API } from "../../api/axios";
import "./index.css";

const Chatbot = ({ isDark }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [showFloatingButton, setShowFloatingButton] = useState(true);
    const [showMenu, setShowMenu] = useState(false);

    const panelRef = useRef(null);
    const messagesEndRef = useRef(null);
    const menuRef = useRef(null);

    const quickReplies = [
        "What should I do if I have a toothache?",
        "How often should I visit the dentist?",
        "What foods should I avoid for my teeth?",
    ];

    const sendMessage = async (optionalMessage) => {
        const text = optionalMessage || input.trim();
        if (!text || loading) return;

        const newMessages = [...messages, { role: "user", content: text }];
        setMessages(newMessages);
        setInput("");
        setLoading(true);
        setShowMenu(false);

        try {
            const res = await API.post("/chatbot", { message: text });
            const data = res.data;
            setMessages([...newMessages, { role: "assistant", content: data.reply }]);
        } catch (err) {
            setMessages([
                ...newMessages,
                { role: "assistant", content: "Sorry, something went wrong. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        setIsOpen(true);
        setShowFloatingButton(false);
    };

    const handleClose = () => {
        setIsOpen(false);
        setShowMenu(false);
    };

    const clearChat = () => {
        setMessages([]);
        setShowMenu(false);
    };

    // Scroll on new messages
    useEffect(() => {
        const handleClickOutside = (event) => {
            const target = event.target;

            // Close chatbot panel if clicking outside
            if (isOpen && panelRef.current && !panelRef.current.contains(target)) {
                handleClose();
            }

            // Close menu if clicking outside
            if (showMenu && menuRef.current && !menuRef.current.contains(target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        // Scroll to bottom on new messages or when opening
        if (isOpen || loading || messages.length > 0) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 50);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, showMenu, messages, loading]);

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end sm:items-auto sm:justify-end">
            {/* Floating Button */}
            {showFloatingButton && !isOpen && (
                <div className="relative group">
                    <div
                        className={`absolute right-14 bottom-1/2 translate-y-1/2 hidden group-hover:block text-xs px-3 py-2 rounded shadow-md w-48 
                        ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
                    >
                        Need help? Start a chat 💬
                    </div>
                    <motion.button
                        onClick={handleOpen}
                        className="w-14 h-14 rounded-full bg-blue-600 shadow-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                        <ChatIcon />
                    </motion.button>
                </div>
            )}

            <AnimatePresence onExitComplete={() => setShowFloatingButton(true)}>
                {isOpen && (
                    <motion.div
                        ref={panelRef}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                        className={`fixed inset-0 sm:static sm:w-[420px] h-full sm:h-[85vh] border sm:rounded-2xl shadow-lg flex flex-col overflow-hidden z-50
                        ${isDark ? "bg-gray-900 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"}`}
                    >
                        {/* Header */}
                        <div
                            className={`px-4 py-3 flex justify-between items-center text-sm font-semibold shadow-sm relative
                ${isDark ? "bg-gray-800 border-b border-gray-700" : "bg-white border-b border-gray-200"}`}
                        >
                            <span>Medical Assistant</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className={`text-xl px-2 py-1 rounded ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                                >
                                    ⋯
                                </button>
                                <button
                                    onClick={handleClose}
                                    className={`${isDark ? "hover:text-gray-300" : "hover:text-gray-500"} transition`}
                                >
                                    ✖
                                </button>
                                {showMenu && (
                                    <div
                                        ref={menuRef}
                                        className={`absolute right-12 top-10 z-50 rounded-md text-sm shadow-lg
                                        ${isDark ? "bg-gray-800 text-white border border-gray-700" : "bg-white text-gray-800 border border-gray-200"}`}
                                    >
                                        <button
                                            onClick={clearChat}
                                            className={`flex items-center gap-2 px-4 py-2 w-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                                                }`}
                                        >
                                            🧹 Clear chat
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            className={`flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm ${isDark ? "bg-gray-800 text-white" : "bg-gray-50 text-gray-800"
                                }`}
                        >
                            {messages.length === 0 && (
                                <div className="space-y-4">
                                    <div
                                        className={`px-4 py-3 rounded-md shadow-sm ${isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        I'm here to help with dental-related questions. Choose one below or ask your own!
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {quickReplies.map((q, i) => (
                                            <button
                                                key={i}
                                                onClick={() => sendMessage(q)}
                                                className={`text-left px-4 py-2 rounded-full text-sm transition ${isDark
                                                    ? "bg-blue-800 text-white hover:bg-blue-700"
                                                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                                    }`}
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div
                                        className={`px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed whitespace-pre-line shadow-sm ${msg.role === "user"
                                            ? "bg-blue-600 text-white"
                                            : isDark
                                                ? "bg-gray-700 text-white"
                                                : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {loading && (
                                <div className="flex items-end space-x-2">
                                    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-blue-500 text-white text-xs font-bold">
                                        💬
                                    </div>
                                    <div
                                        className={`flex gap-1 items-center px-4 py-2 rounded-2xl shadow-sm ${isDark ? "bg-gray-700" : "bg-gray-200"
                                            }`}
                                    >
                                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0s]" />
                                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div
                            className={`flex items-center gap-2 px-3 py-2 border-t ${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
                                }`}
                        >
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Ask a medical question..."
                                disabled={loading}
                                className={`flex-1 text-sm px-3 py-2 rounded-full outline-none disabled:opacity-50 placeholder:text-gray-400 ${isDark ? "bg-gray-800 text-white placeholder:text-gray-500" : "bg-gray-100 text-gray-800"
                                    }`}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={loading || !input.trim()}
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                Send
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Chatbot;
