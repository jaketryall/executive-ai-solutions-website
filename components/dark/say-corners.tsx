"use client";

import { useEffect, useState } from "react";
import { replyLine } from "@/lib/greeting";
import { NEXT_START } from "@/lib/proof";

/* §02a · THE CORNERS (2026-09-20 — leoparpeix's bee block, decodes/
   leoparpeix.md §15: four small facts at 14px in the screen's top
   corners, nothing else on the screen but the title. Jake: "I just like
   the fact there is stuff there … more specific stuff to us like maybe
   time, location, and availability for projects, maybe can use that for
   some sense of urgency too"). Left: where we are. Right: the time here
   (the visitor's own clock in our zone, ticking), when a message gets
   answered (lib/greeting.ts's replyLine — real office hours, the honest
   urgency), and the capacity line (NEXT_START, lib/proof.ts — only while
   Jake has set a real one; "one build at a time" otherwise, which is
   simply true). Client-only tick, same reasoning as the old LiveTile:
   Phoenix time is the visitor's now, not the build's. */
export default function SayCorners() {
  const [time, setTime] = useState<string | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Phoenix",
      hour: "numeric",
      minute: "2-digit",
    });
    const tick = () => {
      const now = new Date();
      setTime(fmt.format(now));
      /* replyLine is written in the old tile's caps — sentence case here,
         day names kept proper */
      setReply(
        replyLine(now)
          .toLowerCase()
          .replace(/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/g, (d) => d[0].toUpperCase() + d.slice(1))
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const sentence = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return (
    <>
      <div className="dr-say-corner dr-say-corner--l">
        <span>Mesa, Arizona</span>
        <span className="dr-say-dim">Building for anyone, anywhere</span>
      </div>
      <div className="dr-say-corner dr-say-corner--r">
        <span>
          Phoenix <time>{time ?? "  :  "}</time>
        </span>
        <span className="dr-say-dim">{reply ? sentence(reply) : " "}</span>
        <span className="dr-say-dim">
          {NEXT_START ? `Next start: ${NEXT_START}` : "One build at a time"}
        </span>
      </div>
    </>
  );
}
