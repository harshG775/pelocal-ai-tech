"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Volume2 } from "lucide-react";

function TTSConverter() {
    const [text, setText] = useState("");
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConvert = async () => {
        if (!text.trim()) {
            setError("Please enter some text to convert");
            return;
        }

        setIsLoading(true);
        setError(null);
        setAudioUrl(null);

        try {
            const response = await fetch("/api/tts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to convert text to speech");
            }

            const audioBlob = await response.blob();
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            console.error("[v0] TTS conversion error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-2xl bg-card border-border shadow-2xl">
            <CardHeader className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <Volume2 className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-balance">Multilingual Text to Speech</CardTitle>
                </div>
                <CardDescription className="text-muted-foreground text-base">
                    Convert your text to natural-sounding speech. Supports Hindi, English, and mixed languages.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="text-input" className="text-sm font-medium text-foreground">
                        Enter your text
                    </label>
                    <Textarea
                        id="text-input"
                        placeholder="Type or paste your text here... (e.g., Hello! मैं एक टेक्स्ट-टू-स्पीच ऐप हूं।)"
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value);
                            setError(null);
                        }}
                        className="min-h-[150px] resize-none bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                        disabled={isLoading}
                    />
                </div>

                {error && (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                        <p className="text-sm text-destructive font-medium">{error}</p>
                    </div>
                )}

                <Button
                    onClick={handleConvert}
                    disabled={isLoading || !text.trim()}
                    className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Converting...
                        </>
                    ) : (
                        <>
                            <Volume2 className="w-5 h-5 mr-2" />
                            Convert to Speech
                        </>
                    )}
                </Button>

                {audioUrl && (
                    <div className="space-y-3 p-4 rounded-lg bg-secondary/50 border border-border">
                        <p className="text-sm font-medium text-foreground">Your audio is ready!</p>
                        <audio
                            controls
                            src={audioUrl}
                            className="w-full"
                            style={{
                                filter: "invert(0.85) hue-rotate(180deg)",
                            }}
                        >
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
export default function Home() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-background">
            <TTSConverter />
        </main>
    );
}
