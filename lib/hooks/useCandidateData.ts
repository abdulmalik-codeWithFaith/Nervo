"use client";

// hooks/useCompanyData.ts
// Fetches the logged-in company's data + campaigns from Firestore.
// Components never touch Firebase directly — they call these hooks.

import { useState, useEffect } from "react";
import {
  collection, query, where, orderBy,
  getDocs, getDoc, doc, addDoc, updateDoc,
  increment, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuthState } from "@/lib/hooks/useAuth";

export interface CompanyProfile {
  companyName: string;
  email:       string;
  createdAt:   any;
}

export interface Campaign {
  id:                string;
  companyId:         string;
  companyName:       string;
  role:              string;
  yearsExperience:   string;
  skills:            string[];
  otherRequirements: string;
  applicantCap:      number;
  applicantCount:    number;
  availableSlots:    string[];
  status:            "Active" | "Paused" | "Closed" | "Draft";
  linkToken:         string;
  createdAt:         number;
}

export interface NewCampaignInput {
  companyName:       string;
  role:              string;
  yearsExperience:   string;
  skills:            string[];
  otherRequirements: string;
  applicantCap:      number;
  availableSlots:    string[];
  linkToken:         string;
}

// ── Fetch company profile from users/{uid} ────────────────
export function useCompanyProfile() {
  const { user } = useAuthState();
  const [companyName, setCompanyName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    getDoc(doc(db, "users", user.uid)).then(snap => {
      if (snap.exists()) {
        const d = snap.data();
        setCompanyName(d.companyName ?? "");
      }
      setLoading(false);
    });
  }, [user]);

  return { companyName, loading };
}

// ── Fetch all campaigns belonging to this company ─────────
export function useCampaigns() {
  const { user } = useAuthState();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }

    const q = query(
      collection(db, "campaigns"),
      where("companyId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    getDocs(q).then(snap => {
      const data: Campaign[] = snap.docs.map(d => {
        const r = d.data();
        const ts = r.createdAt?.toDate?.() ?? new Date();
        return {
          id:                d.id,
          companyId:         r.companyId,
          companyName:       r.companyName ?? "",
          role:              r.role ?? "",
          yearsExperience:   r.yearsExperience ?? "",
          skills:            r.skills ?? [],
          otherRequirements: r.otherRequirements ?? "",
          applicantCap:      r.applicantCap ?? 0,
          applicantCount:    r.applicantCount ?? 0,
          availableSlots:    r.availableSlots ?? [],
          status:            r.applicantCount >= r.applicantCap ? "Closed" : (r.status ?? "Active"),
          linkToken:         r.linkToken ?? "",
          createdAt:         ts.getTime(),
        };
      });
      setCampaigns(data);
      setLoading(false);
    });
  }, [user]);

  return { campaigns, loading };
}

// ── Create a new campaign (writes to Firestore) ───────────
export function useCreateCampaign() {
  const { user } = useAuthState();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createCampaign(input: NewCampaignInput): Promise<string | null> {
    if (!user) {
      setError("Not signed in.");
      return null;
    }
    setSubmitting(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, "campaigns"), {
        companyId:         user.uid,
        companyName:       input.companyName,
        role:              input.role,
        yearsExperience:   input.yearsExperience,
        skills:            input.skills,
        otherRequirements: input.otherRequirements,
        applicantCap:      input.applicantCap,
        applicantCount:    0,
        availableSlots:    input.availableSlots,
        status:            "Active",
        linkToken:         input.linkToken,
        createdAt:         serverTimestamp(),
      });
      return docRef.id;
    } catch (e: any) {
      setError(e.message ?? "Failed to create campaign.");
      return null;
    } finally {
      setSubmitting(false);
    }
  }

  return { createCampaign, submitting, error };
}

// ── Increment applicant count when someone applies ────────
export async function incrementApplicantCount(campaignId: string, applicantCap: number, currentCount: number): Promise<boolean> {
  if (currentCount >= applicantCap) return false;
  await updateDoc(doc(db, "campaigns", campaignId), {
    applicantCount: increment(1),
  });
  return true;
}