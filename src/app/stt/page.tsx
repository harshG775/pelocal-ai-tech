"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Copy, Trash2, Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

export default function SpeechToText() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [interimTranscript, setInterimTranscript] = useState("");
    const [language, setLanguage] = useState("en-US");
    const [isSupported, setIsSupported] = useState(true);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();

            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.lang = language;

            recognitionRef.current.onresult = (event: any) => {
                let interim = "";
                let final = "";

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcriptPiece = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        final += transcriptPiece + " ";
                    } else {
                        interim += transcriptPiece;
                    }
                }

                if (final) {
                    setTranscript((prev) => prev + final);
                }
                setInterimTranscript(interim);
            };

            recognitionRef.current.onerror = (event: any) => {
                console.error("Speech recognition error:", event.error);
                if (event.error === "no-speech") {
                    console.log({
                        title: "No speech detected",
                        description: "Please try speaking again.",
                        variant: "destructive",
                    });
                } else if (event.error === "not-allowed") {
                    console.log({
                        title: "Microphone access denied",
                        description: "Please allow microphone access to use this feature.",
                        variant: "destructive",
                    });
                }
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                console.log("Speech recognition ended");
                if (isListening) {
                    recognitionRef.current.start();
                }
            };
        } else {
            setIsSupported(false);
            console.log({
                title: "Not supported",
                description: "Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.",
                variant: "destructive",
            });
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [language]);

    const toggleListening = () => {
        if (!isSupported) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            setInterimTranscript("");
        } else {
            recognitionRef.current.lang = language;
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleCopy = async () => {
        if (transcript) {
            await navigator.clipboard.writeText(transcript);
            console.log({
                title: "Copied!",
                description: "Transcript copied to clipboard.",
            });
        }
    };

    const handleClear = () => {
        setTranscript("");
        setInterimTranscript("");
        console.log({
            title: "Cleared",
            description: "Transcript has been cleared.",
        });
    };

    const handleLanguageChange = (value: string) => {
        const wasListening = isListening;
        if (wasListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
        setLanguage(value);
        if (wasListening) {
            setTimeout(() => {
                recognitionRef.current.lang = value;
                recognitionRef.current.start();
                setIsListening(true);
            }, 100);
        }
    };

    return (
        <main className="container mx-auto px-4 py-8 md:py-16 max-w-4xl">
            <div className="text-center mb-8 md:mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Speech to Text</h1>
                <p className="text-lg text-muted-foreground text-balance">
                    Speak naturally in multiple languages and watch your words transcribe in real-time
                </p>
            </div>

            <Card className="p-6 md:p-8 mb-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Languages className="h-5 w-5 text-muted-foreground" />
                        <Select value={language} onValueChange={handleLanguageChange}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en-US">English (US)</SelectItem>
                                <SelectItem value="en-GB">English (UK)</SelectItem>
                                <SelectItem value="hi-IN">Hindi (India)</SelectItem>
                                <SelectItem value="es-ES">Spanish</SelectItem>
                                <SelectItem value="fr-FR">French</SelectItem>
                                <SelectItem value="de-DE">German</SelectItem>
                                <SelectItem value="zh-CN">Chinese (Mandarin)</SelectItem>
                                <SelectItem value="ja-JP">Japanese</SelectItem>
                                <SelectItem value="ar-SA">Arabic</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        {isListening && (
                            <Badge variant="default" className="bg-accent text-accent-foreground">
                                <span className="relative flex h-2 w-2 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-foreground opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-foreground"></span>
                                </span>
                                Recording
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="flex justify-center mb-8">
                    <Button
                        size="lg"
                        onClick={toggleListening}
                        disabled={!isSupported}
                        className={`h-24 w-24 rounded-full transition-all sm:[&_svg:not([class*='size-'])]:size-6 ${
                            isListening
                                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                : "bg-blue-500 hover:bg-blue-500/90 text-blue-50"
                        }`}
                    >
                        {isListening ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
                    </Button>
                </div>

                <div className="min-h-[200px] p-6 bg-muted rounded-lg mb-4">
                    {transcript || interimTranscript ? (
                        <p className="text-lg leading-relaxed whitespace-pre-wrap">
                            <span className="text-foreground">{transcript}</span>
                            <span className="text-muted-foreground italic">{interimTranscript}</span>
                        </p>
                    ) : (
                        <p className="text-muted-foreground text-center py-12">
                            {isListening
                                ? "Listening... Start speaking"
                                : "Click the microphone button to start recording"}
                        </p>
                    )}
                </div>

                <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={handleCopy} disabled={!transcript}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClear}
                        disabled={!transcript && !interimTranscript}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                </div>
            </Card>
        </main>
    );
}
