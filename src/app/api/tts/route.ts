import { type NextRequest, NextResponse } from "next/server";

const accountId = "63721f1e6aaa78e9e4c7723413e8d34e";
const apiToken = "tGDQfScaUE-RIPxEJFhjz-2tnfMWwFqc2I8cw0bj";
const endpoint = "https://api.cloudflare.com";

export async function POST(request: NextRequest) {
    const { text } = await request.json();
    const payload = {
        text,
        speaker: "angus",
        encoding: "mp3",
    };
    const cfResp = await fetch(`${endpoint}/client/v4/accounts/${accountId}/ai/run/@cf/deepgram/aura-1`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
    const audioBuffer = await cfResp.arrayBuffer();
    
    return new NextResponse(audioBuffer, {
        headers: {
            "content-type": "audio/mpeg",
        },
    });
}
