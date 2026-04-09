import { NextRequest, NextResponse } from "next/server";
import { getClient } from "@/utils/backend/config/chat";
import { modelName } from "@/utils/backend/config/model";
import { system } from "@/config/prompts/chatPrompt.json";
const client = getClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message } = body;
    const problemName = message.problemName;
    if (!message || !problemName) {
      return NextResponse.json({ error: "Message and problemName are required" }, { status: 400 });
    }
    // console.log(message) 
    let nodesInfo=""
    nodesInfo+=`User is currently working on problem: ${problemName}\n`
    for (const key in message.edgesInfo) {
      nodesInfo += `Component ${key} is connected to ${message.edgesInfo[key].connections} which are other nodes in the diagram 
      and ${key} has properties ${JSON.stringify(message.edgesInfo[key].props)}\n`;
    }
    // console.log(nodesInfo)
    const finalMsg = system + "\n\n" + nodesInfo
    const apiResponse = await client.chat.completions.create({
      model: modelName,
      messages: [{ role: "user", content: finalMsg }],
      stream: false,
    });
    console.log("res is ", apiResponse.choices[0]?.message?.content);
    return NextResponse.json({ 
      response: apiResponse.choices[0]?.message?.content 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
