"use client";

import { motion, useMotionValue, useTransform, useSpring, useScroll } from "framer-motion";
import { useEffect, useRef, useState, createContext, useContext } from "react";
import Image from "next/image";
import Link from "next/link";

/* --- Animation system --- */
const ease = [0.51, 0, 0.08, 1] as const;
const easeOut = [0.16, 1, 0.3, 1] as const;

const stagger = { visible: { transition: { staggerChildren: 0.12 } } };
const staggerSlow = { visible: { transition: { staggerChildren: 0.2 } } };
const staggerFast = { visible: { transition: { staggerChildren: 0.08 } } };

const reveal = {
  hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1.0, ease } },
};

const revealTag = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: easeOut } },
};

const revealSoft = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

const revealCard = {
  hidden: { opacity: 0, y: 60, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.9, ease } },
};

const revealSlide = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: easeOut } },
};

const revealNumber = {
  hidden: { opacity: 0, scale: 0.7, filter: "blur(16px)" },
  visible: { opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 1.0, ease } },
};

const revealButton = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: easeOut, delay: 0.1 } },
};

function useParallax(ref: React.RefObject<HTMLElement | null>, distance = 50) {
  const { scrollYProgress } = useScroll({
    target: ref as React.RefObject<HTMLElement>,
    offset: ["start end", "end start"],
  });
  return useTransform(scrollYProgress, [0, 1], [distance, -distance]);
}

/* --- Line-by-line heading reveal --- */
function RevealHeading({ children, className = "", as: Tag = "h2" }: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  const lines = typeof children === "string"
    ? children.split("\n")
    : Array.isArray(children) ? children : [children];

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            variants={{
              hidden: { y: "110%" },
              visible: {
                y: "0%",
                transition: { duration: 0.7, ease, delay: i * 0.1 },
              },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RevealSection({ children, className = "", variants: v = stagger, margin = "-80px" }: {
  children: React.ReactNode;
  className?: string;
  variants?: any;
  margin?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin }}
      variants={v}
    >
      {children}
    </motion.div>
  );
}

/* --- i18n --- */
type Lang = "zh-Hant" | "zh-Hans" | "en";
const I18N: Record<Lang, Record<string, string>> = {
  "zh-Hant": {
    "nav.about": "\u95dc\u65bc\u6211\u5011", "nav.services": "\u670d\u52d9\u9805\u76ee", "nav.community": "\u793e\u7fa4\u8207\u5925\u4f34", "nav.events": "\u6d3b\u52d5",
    "nav.research": "NodeZ Research", "nav.research.articles": "\u8abf\u7814\u6587\u7ae0", "nav.research.videos": "\u5f71\u97f3\u5167\u5bb9",
    "nav.research.articlesDesc": "\u6df1\u5ea6\u8abf\u7814\u8207\u5206\u6790", "nav.research.videosDesc": "\u5f71\u7247\u6559\u5b78\u8207\u8a2a\u8ac7",
    "contact.btn": "\u806f\u7d61\u6211\u5011",
    "hero.tag": "Web3 Brand Marketing \u00b7 Asia",
    "hero.t1": "Web3 \u54c1\u724c", "hero.t2": "\u5728\u4e9e\u6d32\u843d\u5730", "hero.t3": "\u7531\u6211\u5011\u627f\u63a5",
    "hero.desc1": "Nodez \u662f\u4e00\u9593\u5c08\u6ce8\u65bc\u4e9e\u6d32\u5e02\u5834\u7684 Web3 \u54c1\u724c\u884c\u92b7 Agency\u3002\u6211\u5011\u628a\u5c08\u696d\u5167\u5bb9\u5beb\u6210",
    "hero.desc2": "\u76ee\u6a19\u53d7\u773e\u9858\u610f\u8b80\u3001\u9858\u610f\u5206\u4eab\u7684\u6558\u4e8b\u2014\u2014\u5f9e\u4ea4\u6613\u6240\u54c1\u724c\u9031\u3001\u5354\u8b70\u65b9\u5168\u6848\u884c\u92b7\uff0c\u5230\u4f01\u696d Web3 \u843d\u5730\u3002",
    "hero.cta1": "\u958b\u59cb\u5408\u4f5c", "hero.cta2": "\u67e5\u770b\u670d\u52d9\u65b9\u6848",
    "why.tag": "Why brands pick us", "why.t1": "\u70ba\u4ec0\u9ebc\u9078\u64c7", "why.t2": "Nodez",
    "why.1": "\u5728\u5730\u5718\u968a\u57f7\u884c\uff0c\u4e0d\u53ea\u662f\u7ffb\u8b6f\u6587\u6848", "why.2": "\u7dda\u4e0b\u6d3b\u52d5\u8207\u7dda\u4e0a\u5206\u767c\u540c\u4e00\u500b\u7a97\u53e3",
    "why.3": "\u6578\u767e\u4f4d KOL \u8207 SaaS \u77e9\u9663\u865f\u96a8\u6642\u53ef\u8abf\u5ea6", "why.4": "\u628a\u5c08\u696d\u5167\u5bb9\u5beb\u6210\u89c0\u773e\u6703\u4e3b\u52d5\u5206\u4eab\u7684\u6558\u4e8b",
    "get.tag": "What you walk away with", "get.t1": "\u5408\u4f5c\u5f8c\u4f60\u6703", "get.t2": "\u5f97\u5230",
    "get.1": "\u4e00\u4efd\u80fd\u76f4\u63a5\u57f7\u884c\u7684\u4e9e\u6d32\u5e02\u5834\u884c\u92b7\u85cd\u5716", "get.2": "\u6d3b\u52d5\u73fe\u5834\u3001\u5a92\u9ad4\u66dd\u5149\u8207\u793e\u7fa4\u89f8\u53ca\u7684\u5b8c\u6574\u6578\u64da",
    "get.3": "\u53ef\u91cd\u8907\u5229\u7528\u7684\u54c1\u724c\u6558\u4e8b\u8207\u7d20\u6750\u5eab", "get.4": "\u5728\u5730\u901a\u8def\u3001KOL \u8207\u5834\u5730\u7684\u9577\u671f\u5408\u4f5c\u9023\u7d50",
    "is.1": "Meetup \u8207\u54c1\u724c\u9031", "is.2": "Workshop \u8207\u6559\u80b2\u8ab2\u7a0b", "is.3": "\u65b0\u529f\u80fd\u767c\u5e03\u8207\u7522\u54c1\u9ad4\u9a57", "is.4": "\u8de8\u57ce\u843d\u5730\u6d3b\u52d5\u7d71\u7c4c",
    "stmt.l0": "\u628a\u4e00\u5834\u6d3b\u52d5\uff0c\u505a\u6210", "stmt.do": "", "stmt.1": "\u503c\u5f97\u8a18\u4f4f\u7684\u73fe\u5834\u3001", "stmt.2": "\u80fd\u50b3\u958b\u7684\u6545\u4e8b\u3001", "stmt.3": "\u6703\u5ef6\u7e8c\u7684\u95dc\u4fc2\u3002",
    "ev.tag": "Selected events", "ev.title": "\u6211\u5011\u8fa6\u904e\u7684\u6d3b\u52d5\u3002",
    "ev.1": "Sui \u00d7 NodeZ \u54c1\u724c\u9031 \u00b7 \u53f0\u5317", "ev.2": "Sui \u751f\u614b Meetup \u00b7 80+ \u53c3\u8207\u8005", "ev.3": "Haedal \u00d7 Sui \u751f\u614b\u5206\u4eab\u6703", "ev.4": "Web3 \u958b\u767c\u8005 Workshop \u00b7 \u653f\u5927", "ev.5": "NodeZ \u793e\u7fa4\u4ea4\u6d41\u6703 \u00b7 \u53f0\u5317",
    "svc.tag": "Services", "svc.title1": "\u4e09\u689d\u670d\u52d9\u7dda\uff0c", "svc.title2": "\u4e00\u689d\u50b3\u64ad\u93c8\u3002",
    "svc.1.tag": "A \u00b7 EXCHANGES", "svc.1.t": "\u4ea4\u6613\u6240\u54c1\u724c\u6d3b\u52d5", "svc.1.d": "\u70ba\u4ea4\u6613\u6240\u64cd\u76e4\u4e9e\u6d32\u8de8\u57ce\u54c1\u724c\u9031\u8207\u529f\u80fd\u767c\u5e03\uff0c\u628a\u7dda\u4e0b\u80fd\u91cf\u4e32\u6210\u7dda\u4e0a\u8072\u91cf\u3002",
    "svc.1.k1": "\u54c1\u724c\u9031", "svc.1.k2": "Meetup", "svc.1.k3": "\u65b0\u529f\u80fd\u767c\u5e03", "svc.1.k4": "KOL \u5206\u767c", "svc.1.k5": "\u4e9e\u6d32\u8de8\u57ce",
    "svc.2.tag": "B \u00b7 PROJECTS", "svc.2.t": "\u5354\u8b70\u65b9\u5168\u6848\u884c\u92b7", "svc.2.d": "\u5f9e\u4ee3\u5e63 GTM\u3001\u4e0a\u6240 Campaign \u5230 Research \u00d7 PR\uff0c\u628a\u5354\u8b70\u7684\u6280\u8853\u50f9\u503c\u7ffb\u8b6f\u6210\u5e02\u5834\u8a9e\u8a00\u3002",
    "svc.2.k1": "\u4ee3\u5e63 GTM", "svc.2.k2": "\u4e0a\u6240 Campaign", "svc.2.k3": "Research \u00d7 PR", "svc.2.k4": "AMA \u7cfb\u5217", "svc.2.k5": "\u751f\u614b\u727d\u7dda",
    "svc.3.tag": "C \u00b7 ENTERPRISES", "svc.3.t": "\u4f01\u696d Web3 \u54c1\u724c\u670d\u52d9", "svc.3.d": "\u5354\u52a9 Web2 \u4f01\u696d\u8de8\u9032 Web3\u2014\u2014\u5f62\u8c61\u5347\u7d1a\u3001\u54c1\u724c\u8a9e\u8a00\u8f49\u8b6f\uff0c\u4e26\u5728\u53f0\u6e2f\u6771\u5357\u4e9e\u5e02\u5834\u9806\u5229\u843d\u5730\u3002",
    "svc.3.k1": "\u54c1\u724c\u8a9e\u8a00\u8f49\u8b6f", "svc.3.k2": "\u5f62\u8c61\u5347\u7d1a", "svc.3.k3": "\u53f0\u6e2f\u6771\u5357\u4e9e\u843d\u5730", "svc.3.k4": "Web3 Onboarding",
    "ch.tag": "After the event", "ch.title1": "\u6d3b\u52d5\u4e4b\u5f8c\uff0c\u6211\u5011\u4e5f\u5e6b\u4f60\u5ef6", "ch.title2": "\u4f38\u51fa\u53bb\u3002",
    "ch.yt.d": "\u6d3b\u52d5\u73fe\u5834\u526a\u8f2f\u8207\u8a2a\u8ac7", "ch.x.d": "\u6d3b\u52d5\u73fe\u5834\u76f4\u64ad\u8207\u8cfd\u5f8c\u5206\u4eab", "ch.ig.d": "\u6d3b\u52d5\u8996\u89ba\u8207\u73fe\u5834\u901f\u5beb", "ch.tg.d": "\u6d3b\u52d5\u5831\u540d\u8207\u5408\u4f5c\u9080\u8acb",
    "cta.title1": "\u628a\u4f60\u7684\u54c1\u724c\uff0c", "cta.title2": "\u5e36\u9032\u4e9e\u6d32\u5e02\u5834\u3002",
    "cta.desc": "\u544a\u8a34\u6211\u5011\u4f60\u7684\u54c1\u724c\u968e\u6bb5\u3001\u76ee\u6a19\u5e02\u5834\u8207\u9810\u671f KPI\u2014\u2014\u6211\u5011\u6703\u5728\u4e00\u500b\u5de5\u4f5c\u65e5\u5167\u56de\u8986\u5efa\u8b70\u65b9\u5411\u8207\u7c97\u4f30\u5831\u50f9\u3002\u6c92\u6709\u696d\u52d9\u96fb\u8a71\uff0c\u4e5f\u4e0d\u7d81\u7d04\u3002",
    "cta.btn": "\u5beb\u4fe1\u7d66\u6211\u5011", "cta.link": "\u67e5\u770b\u4f5c\u54c1\u96c6",
    "stat.brands": "\u5408\u4f5c\u54c1\u724c", "stat.events": "\u6d3b\u52d5", "stat.media": "\u5a92\u9ad4",
    "partner.label": "Trusted Partners",
    "foot": "\u00a9 2026 NodeZ \u00b7 Web3 \u54c1\u724c\u884c\u92b7 Agency",
  },
  "zh-Hans": {
    "nav.about": "\u5173\u4e8e\u6211\u4eec", "nav.services": "\u670d\u52a1\u9879\u76ee", "nav.community": "\u793e\u7fa4\u4e0e\u4f19\u4f34", "nav.events": "\u6d3b\u52a8",
    "nav.research": "NodeZ Research", "nav.research.articles": "\u8c03\u7814\u6587\u7ae0", "nav.research.videos": "\u5f71\u97f3\u5185\u5bb9",
    "nav.research.articlesDesc": "\u6df1\u5ea6\u8c03\u7814\u4e0e\u5206\u6790", "nav.research.videosDesc": "\u5f71\u7247\u6559\u5b66\u4e0e\u8bbf\u8c08",
    "contact.btn": "\u8054\u7edc\u6211\u4eec",
    "hero.tag": "Web3 Brand Marketing \u00b7 Asia",
    "hero.t1": "Web3 \u54c1\u724c", "hero.t2": "\u5728\u4e9a\u6d32\u843d\u5730", "hero.t3": "\u7531\u6211\u4eec\u627f\u63a5",
    "hero.desc1": "Nodez \u662f\u4e00\u95f4\u4e13\u6ce8\u4e8e\u4e9a\u6d32\u5e02\u573a\u7684 Web3 \u54c1\u724c\u884c\u9500 Agency\u3002\u6211\u4eec\u628a\u4e13\u4e1a\u5185\u5bb9\u5199\u6210",
    "hero.desc2": "\u76ee\u6807\u53d7\u4f17\u613f\u610f\u8bfb\u3001\u613f\u610f\u5206\u4eab\u7684\u53d9\u4e8b\u2014\u2014\u4ece\u4ea4\u6613\u6240\u54c1\u724c\u5468\u3001\u534f\u8bae\u65b9\u5168\u6848\u884c\u9500\uff0c\u5230\u4f01\u4e1a Web3 \u843d\u5730\u3002",
    "hero.cta1": "\u5f00\u59cb\u5408\u4f5c", "hero.cta2": "\u67e5\u770b\u670d\u52a1\u65b9\u6848",
    "why.tag": "Why brands pick us", "why.t1": "\u4e3a\u4ec0\u4e48\u9009\u62e9", "why.t2": "Nodez",
    "why.1": "\u5728\u5730\u56e2\u961f\u6267\u884c\uff0c\u4e0d\u53ea\u662f\u7ffb\u8bd1\u6587\u6848", "why.2": "\u7ebf\u4e0b\u6d3b\u52a8\u4e0e\u7ebf\u4e0a\u5206\u53d1\u540c\u4e00\u4e2a\u7a97\u53e3",
    "why.3": "\u6570\u767e\u4f4d KOL \u4e0e SaaS \u77e9\u9635\u53f7\u968f\u65f6\u53ef\u8c03\u5ea6", "why.4": "\u628a\u4e13\u4e1a\u5185\u5bb9\u5199\u6210\u89c2\u4f17\u4f1a\u4e3b\u52a8\u5206\u4eab\u7684\u53d9\u4e8b",
    "get.tag": "What you walk away with", "get.t1": "\u5408\u4f5c\u540e\u4f60\u4f1a", "get.t2": "\u5f97\u5230",
    "get.1": "\u4e00\u4efd\u80fd\u76f4\u63a5\u6267\u884c\u7684\u4e9a\u6d32\u5e02\u573a\u884c\u9500\u84dd\u56fe", "get.2": "\u6d3b\u52a8\u73b0\u573a\u3001\u5a92\u4f53\u66dd\u5149\u4e0e\u793e\u7fa4\u89e6\u53ca\u7684\u5b8c\u6574\u6570\u636e",
    "get.3": "\u53ef\u91cd\u590d\u5229\u7528\u7684\u54c1\u724c\u53d9\u4e8b\u4e0e\u7d20\u6750\u5e93", "get.4": "\u5728\u5730\u901a\u8def\u3001KOL \u4e0e\u573a\u5730\u7684\u957f\u671f\u5408\u4f5c\u8fde\u7ed3",
    "is.1": "Meetup \u4e0e\u54c1\u724c\u5468", "is.2": "Workshop \u4e0e\u6559\u80b2\u8bfe\u7a0b", "is.3": "\u65b0\u529f\u80fd\u53d1\u5e03\u4e0e\u4ea7\u54c1\u4f53\u9a8c", "is.4": "\u8de8\u57ce\u843d\u5730\u6d3b\u52a8\u7edf\u7b79",
    "stmt.l0": "\u628a\u4e00\u573a\u6d3b\u52a8\uff0c\u505a\u6210", "stmt.do": "", "stmt.1": "\u503c\u5f97\u8bb0\u4f4f\u7684\u73b0\u573a\u3001", "stmt.2": "\u80fd\u4f20\u5f00\u7684\u6545\u4e8b\u3001", "stmt.3": "\u4f1a\u5ef6\u7eed\u7684\u5173\u7cfb\u3002",
    "ev.tag": "Selected events", "ev.title": "\u6211\u4eec\u529e\u8fc7\u7684\u6d3b\u52a8\u3002",
    "ev.1": "Sui \u00d7 NodeZ \u54c1\u724c\u5468 \u00b7 \u53f0\u5317", "ev.2": "Sui \u751f\u6001 Meetup \u00b7 80+ \u53c2\u4e0e\u8005", "ev.3": "Haedal \u00d7 Sui \u751f\u6001\u5206\u4eab\u4f1a", "ev.4": "Web3 \u5f00\u53d1\u8005 Workshop \u00b7 \u653f\u5927", "ev.5": "NodeZ \u793e\u7fa4\u4ea4\u6d41\u4f1a \u00b7 \u53f0\u5317",
    "svc.tag": "Services", "svc.title1": "\u4e09\u6761\u670d\u52a1\u7ebf\uff0c", "svc.title2": "\u4e00\u6761\u4f20\u64ad\u94fe\u3002",
    "svc.1.tag": "A \u00b7 EXCHANGES", "svc.1.t": "\u4ea4\u6613\u6240\u54c1\u724c\u6d3b\u52a8", "svc.1.d": "\u4e3a\u4ea4\u6613\u6240\u64cd\u76d8\u4e9a\u6d32\u8de8\u57ce\u54c1\u724c\u5468\u4e0e\u529f\u80fd\u53d1\u5e03\uff0c\u628a\u7ebf\u4e0b\u80fd\u91cf\u4e32\u6210\u7ebf\u4e0a\u58f0\u91cf\u3002",
    "svc.1.k1": "\u54c1\u724c\u5468", "svc.1.k2": "Meetup", "svc.1.k3": "\u65b0\u529f\u80fd\u53d1\u5e03", "svc.1.k4": "KOL \u5206\u53d1", "svc.1.k5": "\u4e9a\u6d32\u8de8\u57ce",
    "svc.2.tag": "B \u00b7 PROJECTS", "svc.2.t": "\u534f\u8bae\u65b9\u5168\u6848\u884c\u9500", "svc.2.d": "\u4ece\u4ee3\u5e01 GTM\u3001\u4e0a\u6240 Campaign \u5230 Research \u00d7 PR\uff0c\u628a\u534f\u8bae\u7684\u6280\u672f\u4ef7\u503c\u7ffb\u8bd1\u6210\u5e02\u573a\u8bed\u8a00\u3002",
    "svc.2.k1": "\u4ee3\u5e01 GTM", "svc.2.k2": "\u4e0a\u6240 Campaign", "svc.2.k3": "Research \u00d7 PR", "svc.2.k4": "AMA \u7cfb\u5217", "svc.2.k5": "\u751f\u6001\u7275\u7ebf",
    "svc.3.tag": "C \u00b7 ENTERPRISES", "svc.3.t": "\u4f01\u4e1a Web3 \u54c1\u724c\u670d\u52a1", "svc.3.d": "\u534f\u52a9 Web2 \u4f01\u4e1a\u8de8\u8fdb Web3\u2014\u2014\u5f62\u8c61\u5347\u7ea7\u3001\u54c1\u724c\u8bed\u8a00\u8f6c\u8bd1\uff0c\u5e76\u5728\u53f0\u6e2f\u4e1c\u5357\u4e9a\u5e02\u573a\u987a\u5229\u843d\u5730\u3002",
    "svc.3.k1": "\u54c1\u724c\u8bed\u8a00\u8f6c\u8bd1", "svc.3.k2": "\u5f62\u8c61\u5347\u7ea7", "svc.3.k3": "\u53f0\u6e2f\u4e1c\u5357\u4e9a\u843d\u5730", "svc.3.k4": "Web3 Onboarding",
    "ch.tag": "After the event", "ch.title1": "\u6d3b\u52a8\u4e4b\u540e\uff0c\u6211\u4eec\u4e5f\u5e2e\u4f60\u5ef6", "ch.title2": "\u4f38\u51fa\u53bb\u3002",
    "ch.yt.d": "\u6d3b\u52a8\u73b0\u573a\u526a\u8f91\u4e0e\u8bbf\u8c08", "ch.x.d": "\u6d3b\u52a8\u73b0\u573a\u76f4\u64ad\u4e0e\u8d5b\u540e\u5206\u4eab", "ch.ig.d": "\u6d3b\u52a8\u89c6\u89c9\u4e0e\u73b0\u573a\u901f\u5199", "ch.tg.d": "\u6d3b\u52a8\u62a5\u540d\u4e0e\u5408\u4f5c\u9080\u8bf7",
    "cta.title1": "\u628a\u4f60\u7684\u54c1\u724c\uff0c", "cta.title2": "\u5e26\u8fdb\u4e9a\u6d32\u5e02\u573a\u3002",
    "cta.desc": "\u544a\u8bc9\u6211\u4eec\u4f60\u7684\u54c1\u724c\u9636\u6bb5\u3001\u76ee\u6807\u5e02\u573a\u4e0e\u9884\u671f KPI\u2014\u2014\u6211\u4eec\u4f1a\u5728\u4e00\u4e2a\u5de5\u4f5c\u65e5\u5185\u56de\u590d\u5efa\u8bae\u65b9\u5411\u4e0e\u7c97\u4f30\u62a5\u4ef7\u3002\u6ca1\u6709\u4e1a\u52a1\u7535\u8bdd\uff0c\u4e5f\u4e0d\u7ed1\u7ea6\u3002",
    "cta.btn": "\u5199\u4fe1\u7ed9\u6211\u4eec", "cta.link": "\u67e5\u770b\u4f5c\u54c1\u96c6",
    "stat.brands": "\u5408\u4f5c\u54c1\u724c", "stat.events": "\u6d3b\u52a8", "stat.media": "\u5a92\u4f53",
    "partner.label": "Trusted Partners",
    "foot": "\u00a9 2026 NodeZ \u00b7 Web3 \u54c1\u724c\u884c\u9500 Agency",
  },
  "en": {
    "nav.about": "About", "nav.services": "Services", "nav.community": "Community", "nav.events": "Events",
    "nav.research": "NodeZ Research", "nav.research.articles": "Research Articles", "nav.research.videos": "Video Content",
    "nav.research.articlesDesc": "In-depth research & analysis", "nav.research.videosDesc": "Tutorials & interviews",
    "contact.btn": "Contact us",
    "hero.tag": "Web3 Brand Marketing \u00b7 Asia",
    "hero.t1": "Web3 brands", "hero.t2": "land in Asia.", "hero.t3": "We make it happen.",
    "hero.desc1": "Nodez is a Web3 brand marketing agency focused on the Asian market. We turn professional content into",
    "hero.desc2": "stories your audience wants to read and share \u2014 from exchange brand weeks and protocol campaigns to enterprise Web3 onboarding.",
    "hero.cta1": "Get started", "hero.cta2": "See services",
    "why.tag": "Why brands pick us", "why.t1": "Why choose", "why.t2": "Nodez",
    "why.1": "Local teams that execute, not just translate", "why.2": "Offline events and online distribution in one window",
    "why.3": "Hundreds of KOLs and SaaS accounts on demand", "why.4": "Turn expert content into stories audiences share",
    "get.tag": "What you walk away with", "get.t1": "What you'll", "get.t2": "get",
    "get.1": "An actionable Asia market marketing blueprint", "get.2": "Full data on event attendance, media exposure, and community reach",
    "get.3": "Reusable brand narrative and asset library", "get.4": "Long-term partnerships with local channels, KOLs, and venues",
    "is.1": "Meetups & brand weeks", "is.2": "Workshops & education", "is.3": "Product launches & demos", "is.4": "Multi-city event coordination",
    "stmt.l0": "We turn events into", "stmt.do": "", "stmt.1": "memorable experiences,", "stmt.2": "shareable stories,", "stmt.3": "lasting relationships.",
    "ev.tag": "Selected events", "ev.title": "Events we've produced.",
    "ev.1": "Sui \u00d7 NodeZ Brand Week \u00b7 Taipei", "ev.2": "Sui Ecosystem Meetup \u00b7 80+ attendees", "ev.3": "Haedal \u00d7 Sui Ecosystem Talk", "ev.4": "Web3 Dev Workshop \u00b7 NCCU", "ev.5": "NodeZ Community Meetup \u00b7 Taipei",
    "svc.tag": "Services", "svc.title1": "Three service lines,", "svc.title2": "one value chain.",
    "svc.1.tag": "A \u00b7 EXCHANGES", "svc.1.t": "Exchange brand events", "svc.1.d": "Multi-city brand weeks and feature launches across Asia, turning offline energy into online reach.",
    "svc.1.k1": "Brand weeks", "svc.1.k2": "Meetup", "svc.1.k3": "Feature launch", "svc.1.k4": "KOL distribution", "svc.1.k5": "Multi-city Asia",
    "svc.2.tag": "B \u00b7 PROJECTS", "svc.2.t": "Protocol full-stack marketing", "svc.2.d": "From token GTM and listing campaigns to Research \u00d7 PR \u2014 translating protocol tech into market language.",
    "svc.2.k1": "Token GTM", "svc.2.k2": "Listing Campaign", "svc.2.k3": "Research \u00d7 PR", "svc.2.k4": "AMA series", "svc.2.k5": "Ecosystem connections",
    "svc.3.tag": "C \u00b7 ENTERPRISES", "svc.3.t": "Enterprise Web3 branding", "svc.3.d": "Helping Web2 companies cross into Web3 \u2014 brand upgrade, language translation, and landing in Taiwan, HK, and SEA markets.",
    "svc.3.k1": "Brand translation", "svc.3.k2": "Image upgrade", "svc.3.k3": "TW/HK/SEA landing", "svc.3.k4": "Web3 Onboarding",
    "ch.tag": "After the event", "ch.title1": "After the event, we help you", "ch.title2": "extend further.",
    "ch.yt.d": "Event clips & interviews", "ch.x.d": "Live coverage & post-event sharing", "ch.ig.d": "Event visuals & sketches", "ch.tg.d": "Event signups & partnership invites",
    "cta.title1": "Bring your brand", "cta.title2": "into Asia.",
    "cta.desc": "Tell us your brand stage, target market, and KPIs \u2014 we'll reply with a recommended direction and rough quote within one business day. No sales calls, no lock-in.",
    "cta.btn": "Write to us", "cta.link": "View portfolio",
    "stat.brands": "Brands", "stat.events": "Events", "stat.media": "Media",
    "partner.label": "Trusted Partners",
    "foot": "\u00a9 2026 NodeZ \u00b7 Web3 Brand Marketing Agency",
  },
};

function useLang() {
  const [lang, setLangState] = useState<Lang>("zh-Hant");
  useEffect(() => {
    const saved = localStorage.getItem("nodez.lang") as Lang | null;
    if (saved && I18N[saved]) setLangState(saved);
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("nodez.lang", l);
    document.documentElement.lang = l;
  };
  const t = (key: string) => I18N[lang]?.[key] ?? I18N["zh-Hant"][key] ?? key;
  return { lang, setLang, t };
}

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: "zh-Hant", setLang: () => {}, t: (k) => k,
});
function useT() { return useContext(LangCtx); }

/* --- Mouse glow --- */
function useMouseGlow(ref: React.RefObject<HTMLElement | null>) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, { stiffness: 40, damping: 25 });
  const sy = useSpring(y, { stiffness: 40, damping: 25 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const h = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      x.set((e.clientX - r.left) / r.width);
      y.set((e.clientY - r.top) / r.height);
    };
    el.addEventListener("mousemove", h);
    return () => el.removeEventListener("mousemove", h);
  }, [ref, x, y]);
  return { sx, sy };
}

/* --- Icon components --- */
function IconCalendar() {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#3aa9f3] rounded-lg flex items-center justify-center shrink-0">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    </div>
  );
}
function IconDocument() {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#3aa9f3] rounded-lg flex items-center justify-center shrink-0">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="12" y2="14" />
      </svg>
    </div>
  );
}
function IconSun() {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#3aa9f3] rounded-lg flex items-center justify-center shrink-0">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    </div>
  );
}
function IconGrid() {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#3aa9f3] rounded-lg flex items-center justify-center shrink-0">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    </div>
  );
}
function IconScreen() {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#3aa9f3] rounded-lg flex items-center justify-center shrink-0">
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    </div>
  );
}
function IconLines() {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#3aa9f3] rounded-lg flex items-center justify-center shrink-0">
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="14" y2="18" />
      </svg>
    </div>
  );
}
function IconPulse() {
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#3aa9f3] rounded-lg flex items-center justify-center shrink-0">
      <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    </div>
  );
}

/* Social icons */
function IconYouTube() {
  return (
    <div className="w-10 h-10 bg-[#3aa9f3] rounded-lg flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M23 9.71a8.5 8.5 0 00-.91-4.13 2.92 2.92 0 00-1.72-1A78.4 78.4 0 0012 4.27a78.5 78.5 0 00-8.34.3 2.87 2.87 0 00-1.46.74c-.9.83-1 2.25-1.1 3.45a48.3 48.3 0 000 6.48 9.4 9.4 0 00.3 2 3.14 3.14 0 00.71 1.36 2.86 2.86 0 001.49.78 45.2 45.2 0 006.5.33 45.2 45.2 0 006.5-.33 2.86 2.86 0 001.49-.78 3.14 3.14 0 00.71-1.36 9.4 9.4 0 00.3-2 48.3 48.3 0 00.1-3.24zM9.74 14.85V8.66l5.92 3.11c-1.97 1.03-3.94 2.06-5.92 3.08z"/></svg>
    </div>
  );
}
function IconX() {
  return (
    <div className="w-10 h-10 bg-[#3aa9f3] rounded-lg flex items-center justify-center">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    </div>
  );
}
function IconInstagram() {
  return (
    <div className="w-10 h-10 bg-[#3aa9f3] rounded-lg flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
        <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none" />
      </svg>
    </div>
  );
}
function IconTelegram() {
  return (
    <div className="w-10 h-10 bg-[#3aa9f3] rounded-lg flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.5.5 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.492-1.302.48-.428-.013-1.252-.242-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
    </div>
  );
}

/* ===================== NAVBAR ===================== */
function Navbar() {
  const { lang, setLang, t } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setResearchOpen(false);
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const langLabel: Record<Lang, string> = { "zh-Hant": "\u7e41", "zh-Hans": "\u7b80", "en": "EN" };

  const links = [
    { k: "nav.about", href: "#about" },
    { k: "nav.services", href: "#services" },
    { k: "nav.community", href: "#channels" },
    { k: "nav.events", href: "#events" },
  ];

  return (
    <motion.nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
        scrolled
          ? "bg-[#0c0c10]/92 backdrop-blur-2xl border-b border-white/[0.06]"
          : "bg-[#0c0c10]"
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-[52px] flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 shrink-0">
          <Image src="/logo-z.png" alt="NodeZ" width={24} height={24} />
          <span className="text-[15px] font-semibold tracking-tight text-white">NodeZ</span>
        </a>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.k}
              href={l.href}
              className="px-4 py-1.5 text-[13px] text-white/50 hover:text-white transition-colors duration-300"
            >
              {t(l.k)}
            </a>
          ))}

          <div ref={dropdownRef} className="relative ml-2">
            <button
              onClick={() => setResearchOpen(!researchOpen)}
              className={`flex items-center gap-2 px-4 py-[6px] text-[13px] font-medium rounded-lg transition-all duration-300 ${
                researchOpen
                  ? "bg-[#f97316]/12 text-[#f97316] border border-[#f97316]/30"
                  : "bg-white/[0.04] text-white/60 border border-white/[0.08] hover:bg-[#f97316]/10 hover:text-[#f97316] hover:border-[#f97316]/25"
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" className="opacity-80">
                <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
              </svg>
              {t("nav.research")}
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                className={`transition-transform duration-300 opacity-50 ${researchOpen ? "rotate-180" : ""}`}
              >
                <path d="M2.5 4 L5 6.5 L7.5 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {researchOpen && (
              <motion.div
                className="absolute top-full mt-2 right-0 bg-[#111116] border border-white/[0.08] rounded-xl py-2 min-w-[220px] shadow-2xl shadow-black/50 backdrop-blur-xl"
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href="/content" className="flex items-center gap-3.5 px-4 py-3 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-200 mx-1.5 rounded-lg">
                  <div className="w-9 h-9 rounded-lg bg-[#3aa9f3]/10 flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3aa9f3" strokeWidth="1.5"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="16" y2="10" /><line x1="8" y1="14" x2="12" y2="14" /></svg>
                  </div>
                  <div>
                    <div className="font-medium text-white/80">{t("nav.research.articles")}</div>
                    <div className="text-[11px] text-white/30 mt-0.5">{t("nav.research.articlesDesc")}</div>
                  </div>
                </Link>
                <Link href="/video" className="flex items-center gap-3.5 px-4 py-3 text-[13px] text-white/60 hover:text-white hover:bg-white/[0.05] transition-all duration-200 mx-1.5 rounded-lg">
                  <div className="w-9 h-9 rounded-lg bg-[#3aa9f3]/10 flex items-center justify-center shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3aa9f3" strokeWidth="1.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                  </div>
                  <div>
                    <div className="font-medium text-white/80">{t("nav.research.videos")}</div>
                    <div className="text-[11px] text-white/30 mt-0.5">{t("nav.research.videosDesc")}</div>
                  </div>
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div ref={langRef} className="relative hidden sm:block">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-white/45 hover:text-white/80 transition-colors duration-300"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              </svg>
              <span className="text-[12px]">{langLabel[lang]}</span>
            </button>
            {langOpen && (
              <motion.div
                className="absolute top-full mt-2 right-0 bg-[#161619] border border-white/[0.08] rounded-xl py-1.5 min-w-[120px] shadow-2xl shadow-black/40"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
              >
                {(["zh-Hant", "zh-Hans", "en"] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => { setLang(l); setLangOpen(false); }}
                    className={`block w-full text-left px-4 py-2 text-[13px] transition-all duration-200 rounded-lg ${
                      lang === l ? "text-white bg-white/[0.06]" : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    {l === "zh-Hant" ? "\u7e41\u9ad4\u4e2d\u6587" : l === "zh-Hans" ? "\u7b80\u4f53\u4e2d\u6587" : "English"}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          <a
            href="#contact"
            className="bg-[#3aa9f3] hover:bg-[#2d9ae0] text-white text-[13px] font-semibold px-5 py-[7px] rounded-lg transition-all duration-300"
          >
            {t("contact.btn")}
          </a>
        </div>
      </div>
    </motion.nav>
  );
}

/* ===================== HERO ===================== */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { sx, sy } = useMouseGlow(ref);
  const glowX = useTransform(sx, [0, 1], ["35%", "65%"]);
  const glowY = useTransform(sy, [0, 1], ["35%", "65%"]);

  const pixels = [
    { x: "15%", y: "22%", size: 6, delay: 0 },
    { x: "82%", y: "30%", size: 8, delay: 0.3 },
    { x: "10%", y: "55%", size: 5, delay: 0.6 },
    { x: "88%", y: "60%", size: 7, delay: 0.2 },
    { x: "25%", y: "78%", size: 5, delay: 0.5 },
    { x: "78%", y: "80%", size: 6, delay: 0.4 },
    { x: "20%", y: "40%", size: 4, delay: 0.7 },
    { x: "75%", y: "45%", size: 5, delay: 0.1 },
  ];

  return (
    <motion.section ref={ref} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#f7f6f2]">
      <motion.div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none" style={{ left: glowX, top: glowY, x: "-50%", y: "-50%", background: "radial-gradient(circle, rgba(58,169,243,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
      {pixels.map((p, i) => (
        <motion.div key={i} className="absolute bg-[#3aa9f3]" style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0.3, 0.7, 0.3], scale: 1 }}
          transition={{ opacity: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: p.delay }, scale: { duration: 0.8, delay: 1 + p.delay, ease } }}
        />
      ))}
      <div className="absolute w-[420px] h-[420px] sm:w-[560px] sm:h-[560px] lg:w-[650px] lg:h-[650px]">
        <div className="animate-orbit absolute inset-0">
          <svg viewBox="0 0 650 650" className="w-full h-full">
            <circle cx="325" cy="325" r="310" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
            <circle cx="325" cy="325" r="240" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
          </svg>
        </div>
        <div className="animate-orbit-reverse absolute inset-0">
          <svg viewBox="0 0 650 650" className="w-full h-full">
            <circle cx="325" cy="325" r="275" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" strokeDasharray="4 10" />
          </svg>
        </div>
      </div>
      <motion.div className="relative z-10" initial={{ opacity: 0, scale: 0.6, filter: "blur(20px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 1.3, ease }}>
        <Image src="/logo-full.png" alt="NodeZ" width={280} height={280} className="w-[200px] h-[200px] sm:w-[280px] sm:h-[280px] object-contain" priority />
      </motion.div>
      <motion.div className="absolute bottom-10 flex flex-col items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }}>
        <motion.div className="w-px h-8 bg-gradient-to-b from-[#ccc] to-transparent" animate={{ scaleY: [1, 0.4, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} />
      </motion.div>
    </motion.section>
  );
}

/* ===================== MARQUEE ===================== */
function MarqueeStrip() {
  const words = ["NODEZ", "WEB3 EVENTS", "ASIA", "TAIPEI", "BRAND MARKETING", "KOL NETWORK", "SAAS"];
  return (
    <div className="bg-[#f7f6f2] border-y border-[#e5e4df] py-4 overflow-hidden">
      <div className="animate-marquee flex whitespace-nowrap">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center shrink-0">
            {words.map((w) => (
              <span key={`${i}-${w}`} className="flex items-center">
                <span className="text-[11px] tracking-[0.25em] text-[#aaa] font-mono uppercase px-6">{w}</span>
                <span className="w-1 h-1 rounded-full bg-[#3aa9f3]/40 shrink-0" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ===================== HERO CONTENT (DARK) ===================== */
function HeroContent() {
  const { t } = useT();
  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxY = useParallax(sectionRef as React.RefObject<HTMLElement>, 40);

  return (
    <div className="section-dark" ref={sectionRef}>
      <motion.div className="relative max-w-5xl mx-auto px-6 lg:px-10 py-28 sm:py-40" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
        <motion.div className="absolute -left-32 top-1/3 w-72 h-72 bg-[#3aa9f3]/[0.04] rounded-full blur-[100px] pointer-events-none" style={{ y: parallaxY }} />
        <motion.span className="inline-block border border-white/[0.06] rounded-full px-4 py-1.5 text-xs font-mono tracking-wider text-[#9a9aaa]" variants={revealTag}>
          {t("hero.tag")}
        </motion.span>

        <RevealHeading as="h1" className="mt-10 text-[clamp(2.5rem,6vw,5.5rem)] font-black leading-[1.05] tracking-tight">
          {t("hero.t1")}
          {"\n"}
          <span className="text-gradient-blue">{t("hero.t2")}</span>
          {"\n"}
          <span className="text-gradient-blue">{t("hero.t3")}</span>
        </RevealHeading>

        <motion.div className="mt-8 text-base sm:text-lg text-[#9a9aaa] max-w-3xl leading-[1.8]" variants={revealSoft}>
          <p>{t("hero.desc1")}<br />{t("hero.desc2")}</p>
        </motion.div>

        <motion.div className="mt-8 flex flex-wrap items-center gap-4" variants={revealButton}>
          <a href="#contact" className="group flex items-center gap-2 bg-[#3aa9f3] hover:bg-white text-black text-sm font-semibold px-7 py-3 rounded-full transition-all duration-500">
            {t("hero.cta1")} <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </a>
          <a href="#services" className="hover-arrow flex items-center gap-2 border border-white/10 hover:border-white/25 text-sm font-medium px-6 py-3 rounded-full transition-all duration-500 hover:bg-white/[0.04]">
            {t("hero.cta2")} <span className="arr text-[#555566]">&rarr;</span>
          </a>
        </motion.div>

        <motion.div className="mt-20 border-t border-white/[0.06] pt-14" variants={stagger}>
          <div className="flex justify-center gap-16 sm:gap-24 lg:gap-32">
            {[
              { value: 10, label: t("stat.brands") },
              { value: 50, label: t("stat.events") },
              { value: 3, label: t("stat.media") },
            ].map((s, i) => (
              <motion.div key={i} className="text-center" variants={revealNumber}>
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#3aa9f3] leading-none">
                  <ScrambleNumber target={s.value} suffix="+" duration={1.2} />
                </div>
                <p className="mt-3 text-xs sm:text-sm text-[#555566] tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <motion.div className="mt-14 pt-10 border-t border-white/[0.04] text-center" variants={revealSoft}>
            <p className="text-[10px] font-mono tracking-[0.3em] text-[#555566] uppercase mb-8">
              {t("partner.label")}
            </p>
            <div className="flex items-center justify-center gap-14 sm:gap-20">
              <motion.div
                className="opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-700"
                whileHover={{ scale: 1.1, filter: "drop-shadow(0 0 20px rgba(58,169,243,0.3))" }}
              >
                <Image src="/partner-sui.png" alt="Sui" width={48} height={48} />
              </motion.div>
              <motion.div
                className="opacity-50 hover:opacity-100 transition-all duration-700"
                whileHover={{ scale: 1.1, filter: "drop-shadow(0 0 20px rgba(230,81,0,0.3))" }}
              >
                <Image src="/partner-1000x.svg" alt="1000X" width={90} height={45} />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ===================== SCRAMBLE COUNTER ===================== */
function ScrambleNumber({ target, suffix = "+", duration = 1.5 }: { target: number; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState("\u2014");
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          const digits = String(target).length;
          const chars = "0123456789";
          const totalFrames = Math.floor(duration * 30);
          let frame = 0;

          const interval = setInterval(() => {
            frame++;
            if (frame >= totalFrames) {
              setDisplay(String(target));
              setDone(true);
              clearInterval(interval);
              return;
            }
            let result = "";
            for (let i = 0; i < digits; i++) {
              result += chars[Math.floor(Math.random() * chars.length)];
            }
            setDisplay(result);
          }, 1000 / 24);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      <span className={`transition-opacity duration-300 ${done ? "opacity-100" : "opacity-0"}`}>{suffix}</span>
    </span>
  );
}

/* ===================== WHY US + WHAT YOU GET (LIGHT) ===================== */
function WhyUsAndWhatYouGet() {
  const { t } = useT();
  const whyUs = [t("why.1"), t("why.2"), t("why.3"), t("why.4")];
  const whatYouGet = [t("get.1"), t("get.2"), t("get.3"), t("get.4")];

  return (
    <div className="section-light bg-[#eeeee8]" id="about">
      <motion.div className="max-w-6xl mx-auto px-6 lg:px-10 py-28 sm:py-36" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <motion.div className="lg:border-r lg:border-[#ccc] lg:pr-14" variants={staggerSlow}>
            <motion.span className="inline-block border border-[#bbb] rounded-sm px-3 py-1 text-xs font-mono tracking-wider text-[#888]" variants={revealTag}>
              {t("why.tag")}
            </motion.span>
            <motion.h2 className="mt-6 text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[1.05] text-[#111]" variants={reveal}>
              {t("why.t1")}<br />{t("why.t2")}
            </motion.h2>
            <div className="mt-12 space-y-0">
              {whyUs.map((item, i) => (
                <motion.div key={i} className="flex items-center gap-4 py-5 border-b border-[#ccc]" variants={revealSlide}>
                  <span className="w-3.5 h-3.5 bg-[#3aa9f3] rounded-[2px] shrink-0" />
                  <p className="text-[15px] sm:text-base font-semibold text-[#111]">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className="lg:pl-14 mt-16 lg:mt-0" variants={stagger}>
            <motion.span className="inline-block border border-[#bbb] rounded-sm px-3 py-1 text-xs font-mono tracking-wider text-[#888]" variants={revealTag}>
              {t("get.tag")}
            </motion.span>
            <motion.h2 className="mt-6 text-[clamp(2.2rem,5vw,3.8rem)] font-black leading-[1.05] text-[#111]" variants={reveal}>
              {t("get.t1")}<br />{t("get.t2")}
            </motion.h2>
            <div className="mt-12 space-y-0">
              {whatYouGet.map((item, i) => (
                <motion.div key={i} className="flex items-center gap-4 py-5 border-b border-[#ccc]" variants={revealSlide}>
                  <span className="w-3.5 h-3.5 bg-[#3aa9f3] rounded-[2px] shrink-0" />
                  <p className="text-[15px] sm:text-base font-semibold text-[#111]">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

/* ===================== NODEZ IS (LIGHT) ===================== */
function NodezIs() {
  const { t } = useT();
  const items = [
    { title: t("is.1"), icon: <IconCalendar /> },
    { title: t("is.2"), icon: <IconDocument /> },
    { title: t("is.3"), icon: <IconSun /> },
    { title: t("is.4"), icon: <IconGrid /> },
  ];

  return (
    <div className="bg-[#eeeee8]">
      <motion.div className="max-w-5xl mx-auto px-6 lg:px-10 pb-28 sm:pb-36" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
        <div className="bg-[#e6e5df] rounded-2xl p-8 sm:p-10">
          {items.map((item, i) => (
            <motion.div key={i} className={`flex items-center justify-between py-6 sm:py-8 ${i < items.length - 1 ? "border-b border-[#d0cfca]" : ""}`} variants={revealSlide}>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#111]">{item.title}</h3>
              {item.icon}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ===================== STATEMENT (LIGHT) ===================== */
function Statement() {
  const { t } = useT();
  const lines = [
    { icon: <IconScreen />, text: t("stmt.1") },
    { icon: <IconLines />, text: t("stmt.2") },
    { icon: <IconPulse />, text: t("stmt.3") },
  ];

  return (
    <div className="bg-[#eeeee8]">
      <motion.div className="max-w-5xl mx-auto px-6 lg:px-10 py-28 sm:py-36" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerSlow}>
        <motion.div className="text-[clamp(2rem,5.5vw,4.5rem)] font-black leading-[1.25] text-[#111]" variants={reveal}>
          <p>{t("stmt.l0")}</p>
          {lines.map((l, i) => (
            <p key={i} className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
              {l.icon}
              <span className="inline-flex items-center bg-[#111] text-white px-3 sm:px-5 py-1 rounded-sm">
                {l.text}
              </span>
            </p>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ===================== SELECTED EVENTS (LIGHT) ===================== */
function SelectedEvents() {
  const { t } = useT();
  const events = [
    { num: "01", title: t("ev.1"), img: "/event-1.jpg" },
    { num: "02", title: t("ev.2"), img: "/event-2.jpg" },
    { num: "03", title: t("ev.3"), img: "/event-3.jpg" },
    { num: "04", title: t("ev.4"), img: "/event-4.jpg" },
    { num: "05", title: t("ev.5"), img: "/event-5.jpg" },
  ];

  return (
    <div className="bg-[#f7f6f2]" id="events">
      <motion.div className="max-w-6xl mx-auto px-6 lg:px-10 py-28 sm:py-36" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={staggerSlow}>
        <motion.span className="inline-block border border-[#ccc] rounded-sm px-3 py-1 text-xs font-mono tracking-wider text-[#888]" variants={revealTag}>
          {t("ev.tag")}
        </motion.span>
        <motion.h2 className="mt-6 text-[clamp(2.2rem,5vw,4rem)] font-black text-[#111]" variants={reveal}>
          {t("ev.title")}
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-4">
          <motion.div className="group relative rounded-2xl overflow-hidden aspect-[4/3]" variants={revealCard}>
            <Image src={events[0].img} alt={events[0].title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5 flex items-center gap-2">
              <span className="bg-[#3aa9f3] text-white text-xs font-bold px-2 py-0.5 rounded">{events[0].num}</span>
              <span className="text-white text-sm font-medium">{events[0].title}</span>
            </div>
          </motion.div>

          <div className="grid grid-rows-2 gap-4">
            {events.slice(1, 3).map((e) => (
              <motion.div key={e.num} className="group relative rounded-2xl overflow-hidden" variants={revealCard}>
                <Image src={e.img} alt={e.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="bg-[#3aa9f3] text-white text-xs font-bold px-2 py-0.5 rounded">{e.num}</span>
                  <span className="text-white text-sm font-medium">{e.title}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {events.slice(3, 5).map((e) => (
            <motion.div key={e.num} className="group relative rounded-2xl overflow-hidden aspect-[16/9]" variants={revealCard}>
              <Image src={e.img} alt={e.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-5 left-5 flex items-center gap-2">
                <span className="bg-[#3aa9f3] text-white text-xs font-bold px-2 py-0.5 rounded">{e.num}</span>
                <span className="text-white text-sm font-medium">{e.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ===================== SERVICES (LIGHT) ===================== */
function Services() {
  const { t } = useT();
  const data = [
    { num: "01", tag: t("svc.1.tag"), title: t("svc.1.t"), desc: t("svc.1.d"), tags: [t("svc.1.k1"), t("svc.1.k2"), t("svc.1.k3"), t("svc.1.k4"), t("svc.1.k5")] },
    { num: "02", tag: t("svc.2.tag"), title: t("svc.2.t"), desc: t("svc.2.d"), tags: [t("svc.2.k1"), t("svc.2.k2"), t("svc.2.k3"), t("svc.2.k4"), t("svc.2.k5")] },
    { num: "03", tag: t("svc.3.tag"), title: t("svc.3.t"), desc: t("svc.3.d"), tags: [t("svc.3.k1"), t("svc.3.k2"), t("svc.3.k3"), t("svc.3.k4")] },
  ];

  return (
    <div className="bg-[#f7f6f2]" id="services">
      <motion.div className="max-w-5xl mx-auto px-6 lg:px-10 pb-28 sm:pb-36" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
        <motion.span className="inline-block border border-[#ccc] rounded-sm px-3 py-1 text-xs font-mono tracking-wider text-[#888]" variants={revealTag}>
          {t("svc.tag")}
        </motion.span>
        <motion.h2 className="mt-6 text-[clamp(2rem,5vw,3.5rem)] font-black leading-tight text-[#111]" variants={reveal}>
          {t("svc.title1")}<br />{t("svc.title2")}
        </motion.h2>
        <div className="mt-20 space-y-0">
          {data.map((s) => (
            <motion.div key={s.num} className="group border-t border-[#ccc] last:border-b last:border-[#ccc] py-12 sm:py-14" variants={revealCard}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-6 sm:gap-14">
                <motion.span className="text-6xl sm:text-8xl font-black text-black/[0.12] group-hover:text-[#3aa9f3]/25 transition-colors duration-700 shrink-0 leading-none" variants={revealNumber}>{s.num}</motion.span>
                <div className="flex-1">
                  <p className="text-[10px] font-mono tracking-[0.25em] text-[#999] uppercase">{s.tag}</p>
                  <h3 className="mt-2 text-2xl sm:text-3xl font-black text-[#111] group-hover:text-[#2d8fd0] transition-colors duration-500">{s.title}</h3>
                  <p className="mt-3 text-[#666] leading-relaxed max-w-lg">{s.desc}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.tags.map((tg) => (<span key={tg} className="tag-pill">{tg}</span>))}
                  </div>
                  <a href="#contact" className="hover-arrow inline-flex items-center gap-2 mt-6 text-sm font-medium text-[#888] hover:text-[#2d8fd0] transition-colors duration-300">
                    Contact us <span className="arr">&rarr;</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ===================== OWNED CHANNELS (LIGHT) ===================== */
function OwnedChannels() {
  const { t } = useT();
  const channels = [
    { name: "YouTube", handle: "@Node.Z", desc: t("ch.yt.d"), icon: <IconYouTube /> },
    { name: "Twitter / X", handle: "@Node_Z_", desc: t("ch.x.d"), icon: <IconX /> },
    { name: "Instagram", handle: "@node.z_", desc: t("ch.ig.d"), icon: <IconInstagram /> },
    { name: "Telegram", handle: "Join Group", desc: t("ch.tg.d"), icon: <IconTelegram /> },
  ];

  return (
    <div className="bg-[#f7f6f2]" id="channels">
      <motion.div className="max-w-6xl mx-auto px-6 lg:px-10 pb-28 sm:pb-36" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
        <motion.span className="inline-block border border-[#ccc] rounded-sm px-3 py-1 text-xs font-mono tracking-wider text-[#888]" variants={revealTag}>
          {t("ch.tag")}
        </motion.span>
        <motion.h2 className="mt-6 text-[clamp(2.2rem,5vw,4rem)] font-black leading-[1.1] text-[#111]" variants={reveal}>
          {t("ch.title1")}<br />{t("ch.title2")}
        </motion.h2>

        <motion.div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-[#ddd] rounded-2xl overflow-hidden bg-white" variants={revealSoft}>
          {channels.map((c, i) => (
            <div key={c.name} className={`p-6 ${i < channels.length - 1 ? "sm:border-r border-b sm:border-b-0 lg:border-b-0 border-[#eee]" : ""}`}>
              <div className="mb-4">{c.icon}</div>
              <h3 className="text-base font-bold text-[#111]">{c.name}</h3>
              <p className="mt-2 text-xs text-[#999] leading-relaxed">
                {c.handle} &middot; {c.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ===================== CONTACT CTA (DARK) ===================== */
function ContactCTA() {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const { sx, sy } = useMouseGlow(ref as React.RefObject<HTMLElement>);
  const gx = useTransform(sx, [0, 1], ["25%", "75%"]);
  const gy = useTransform(sy, [0, 1], ["25%", "75%"]);

  return (
    <div ref={ref} id="contact" className="section-dark relative overflow-hidden">
      <motion.div className="absolute w-[500px] h-[500px] rounded-full pointer-events-none" style={{ left: gx, top: gy, x: "-50%", y: "-50%", background: "radial-gradient(circle, rgba(58,169,243,0.08) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <motion.div className="relative max-w-5xl mx-auto px-6 lg:px-10 py-28 sm:py-40" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} variants={stagger}>
        <motion.h2 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-[1.1] text-gradient-blue" variants={reveal}>
          {t("cta.title1")}<br />{t("cta.title2")}
        </motion.h2>
        <motion.p className="mt-8 text-[#9a9aaa] leading-[1.85] max-w-xl" variants={reveal}>
          {t("cta.desc")}
        </motion.p>
        <motion.div className="mt-10 flex flex-wrap items-center gap-6" variants={revealButton}>
          <a href="mailto:contact@nodez.io" className="group flex items-center gap-2 bg-[#3aa9f3] hover:bg-white text-black text-sm font-semibold px-7 py-3 rounded-full transition-all duration-500">
            {t("cta.btn")} <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </a>
          <a href="#" className="text-sm text-[#555566] hover:text-[#f2f2f4] underline underline-offset-4 transition-colors duration-300">{t("cta.link")}</a>
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ===================== FOOTER ===================== */
function Footer() {
  const { t } = useT();
  return (
    <footer className="section-dark border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Image src="/logo-z.png" alt="NodeZ" width={18} height={18} />
          <span className="text-xs text-[#555566]">{t("foot")}</span>
        </div>
        <div className="flex items-center gap-5 text-xs text-[#555566]">
          {["contact", "youtube", "twitter", "telegram"].map((l) => (
            <a key={l} href={l === "contact" ? "#contact" : "#"} className="hover:text-[#f2f2f4] transition-colors duration-300">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ===================== COLOR WIPE TRANSITION ===================== */
function ColorWipe({ to }: { to: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const clipY = useTransform(scrollYProgress, [0.2, 0.8], ["100%", "0%"]);
  const lineOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 1, 0]);
  const lineWidth = useTransform(scrollYProgress, [0.3, 0.5, 0.7], ["0%", "60%", "100%"]);

  return (
    <div ref={ref} className="relative h-[200px] overflow-hidden">
      <motion.div
        className="absolute inset-x-0 bottom-0"
        style={{ top: clipY, background: to }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-px pointer-events-none"
        style={{
          width: lineWidth,
          opacity: lineOpacity,
          background: "linear-gradient(90deg, transparent 0%, rgba(58,169,243,0.4) 20%, rgba(58,169,243,0.6) 50%, rgba(58,169,243,0.4) 80%, transparent 100%)",
        }}
      />
    </div>
  );
}

/* ===================== PAGE ===================== */
export default function Home() {
  const langState = useLang();

  return (
    <LangCtx.Provider value={langState}>
    <div className="noise">
      <Navbar />
      <Hero />
      <MarqueeStrip />

      <ColorWipe to="#050508" />
      <HeroContent />

      <ColorWipe to="#eeeee8" />
      <WhyUsAndWhatYouGet />
      <NodezIs />
      <Statement />

      <ColorWipe to="#f7f6f2" />
      <SelectedEvents />
      <Services />
      <OwnedChannels />

      <ColorWipe to="#050508" />
      <ContactCTA />
      <Footer />
    </div>
    </LangCtx.Provider>
  );
}
