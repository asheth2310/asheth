import { NextResponse } from "next/server";
import { SITE } from "@/lib/site";

/**
 * Live GitHub data for the portfolio, cached for 1 hour.
 *
 * GET /api/github
 *   → { repos: Record<repoName, { stars: number; forks: number }> }
 *     Star/fork counts for every public repo — powers the project cards.
 *
 * GET /api/github?repo=<name>
 *   → { stars, forks, files: [{ name, type }], pushedAt }
 *     Repo header stats + top-level file listing — powers the hover preview.
 *
 * Unauthenticated GitHub API calls are limited to 60/hour per IP; the
 * 1-hour `revalidate` keeps us far under that. Set GITHUB_TOKEN env var
 * for a 5,000/hour limit.
 */
export const revalidate = 3600;

const API = "https://api.github.com";

function ghHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "asheth-portfolio",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

interface GhRepo {
  name: string;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
}

interface GhContentItem {
  name: string;
  type: string;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const repo = searchParams.get("repo");

  try {
    if (repo) {
      // Single-repo detail for the hover preview.
      const [repoRes, contentsRes] = await Promise.all([
        fetch(`${API}/repos/${SITE.githubUser}/${repo}`, { headers: ghHeaders() }),
        fetch(`${API}/repos/${SITE.githubUser}/${repo}/contents/`, { headers: ghHeaders() }),
      ]);

      if (repoRes.status === 404) {
        return NextResponse.json({ error: "Repository not found." }, { status: 404 });
      }
      if (!repoRes.ok) {
        throw new Error(`GitHub API responded ${repoRes.status}`);
      }

      const data = (await repoRes.json()) as GhRepo;
      let files: { name: string; type: "file" | "dir" }[] = [];
      if (contentsRes.ok) {
        const items = (await contentsRes.json()) as GhContentItem[];
        files = items
          .slice(0, 6)
          .map((item) => ({
            name: item.name,
            type: item.type === "dir" ? ("dir" as const) : ("file" as const),
          }));
      }

      return NextResponse.json({
        stars: data.stargazers_count,
        forks: data.forks_count,
        pushedAt: data.pushed_at,
        files,
      });
    }

    // All repos: star/fork map for the project cards.
    const res = await fetch(`${API}/users/${SITE.githubUser}/repos?per_page=100`, {
      headers: ghHeaders(),
    });
    if (!res.ok) {
      throw new Error(`GitHub API responded ${res.status}`);
    }
    const repos = (await res.json()) as GhRepo[];
    const map: Record<string, { stars: number; forks: number }> = {};
    for (const r of repos) {
      map[r.name] = { stars: r.stargazers_count, forks: r.forks_count };
    }
    return NextResponse.json({ repos: map });
  } catch (err) {
    console.error("[github] API error:", err);
    // The UI falls back to curated numbers — never break the page for this.
    return NextResponse.json({ error: "GitHub data unavailable." }, { status: 502 });
  }
}
