"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type Topic = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  totalWords: number;
  learnedWords?: number;
};

type Vocabulary = {
  id: string;
  word: string;
  partOfSpeech: string;
  ipa: string;
  meaningVi: string;
  imageUrl?: string | null;
  exampleSentence: string;
  exampleMeaning: string;
  exampleTense?: string | null;
  orderNumber: number;
  isLearned?: boolean;
  isFavorite?: boolean;
  topic?: { title: string; slug: string };
};

type TopicDetail = Topic & {
  vocabularies: Vocabulary[];
};

type QuizQuestion = {
  id: string;
  type: string;
  vocabularyId: string;
  prompt: string;
  options?: Array<
    string | { id: string; word: string; imageUrl?: string | null }
  >;
  tiles?: string[];
  pairs?: Array<{ word: string; meaningVi: string }>;
  sampleAnswer?: string;
};

type Dashboard = {
  learnedWords: number;
  favoriteWords: number;
  dueReviews: number;
  recentAttempts: Array<{
    id: string;
    topic: { title: string; slug: string };
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    wrongAnswers: number;
    duration: number;
    completedAt: string;
  }>;
};

type ReviewDue = {
  id: string;
  dueDate: string;
  interval: number;
  repetitions: number;
  vocabulary: {
    id: string;
    word: string;
    partOfSpeech: string;
    ipa: string;
    meaningVi: string;
    exampleSentence: string;
    exampleMeaning: string;
    topic: { title: string; slug: string };
  };
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const fallbackTopics: Topic[] = [
  {
    id: "demo-topic-1",
    title: "Foundation Words",
    slug: "foundation-words",
    description: "Nhóm từ cơ bản để kiểm tra luồng học, ôn và quiz.",
    totalWords: 4,
    learnedWords: 1,
  },
];

const fallbackDetail: TopicDetail = {
  ...fallbackTopics[0],
  vocabularies: [
    {
      id: "demo-1",
      word: "abandon",
      partOfSpeech: "v",
      ipa: "/əˈbændən/",
      meaningVi: "từ bỏ",
      exampleSentence: "They had to abandon the plan.",
      exampleMeaning: "Họ đã phải từ bỏ kế hoạch.",
      exampleTense: "Past Simple",
      orderNumber: 1,
      isLearned: true,
    },
    {
      id: "demo-2",
      word: "ability",
      partOfSpeech: "n",
      ipa: "/əˈbɪləti/",
      meaningVi: "khả năng",
      exampleSentence: "She has the ability to lead the team.",
      exampleMeaning: "Cô ấy có khả năng lãnh đạo đội.",
      exampleTense: "Present Simple",
      orderNumber: 2,
    },
    {
      id: "demo-3",
      word: "active",
      partOfSpeech: "adj",
      ipa: "/ˈæktɪv/",
      meaningVi: "năng động",
      exampleSentence: "He stays active every day.",
      exampleMeaning: "Anh ấy luôn năng động mỗi ngày.",
      exampleTense: "Present Simple",
      orderNumber: 3,
    },
    {
      id: "demo-4",
      word: "actually",
      partOfSpeech: "adv",
      ipa: "/ˈæktʃuəli/",
      meaningVi: "thực ra",
      exampleSentence: "Actually, I agree with you.",
      exampleMeaning: "Thực ra, tôi đồng ý với bạn.",
      exampleTense: "Present Simple",
      orderNumber: 4,
    },
  ],
};

const emptyDetail: TopicDetail = {
  id: "",
  title: "Chưa chọn chủ đề",
  slug: "",
  description: "Chọn một chủ đề ở cột bên trái để xem danh sách từ.",
  totalWords: 0,
  learnedWords: 0,
  vocabularies: [],
};

const fallbackQuiz: QuizQuestion[] = fallbackDetail.vocabularies.map(
  (vocabulary, index) => ({
    id: `demo-question-${vocabulary.id}`,
    type: index % 2 === 0 ? "MULTIPLE_CHOICE_4" : "VI_TO_EN_TEXT",
    vocabularyId: vocabulary.id,
    prompt: index % 2 === 0 ? vocabulary.word : vocabulary.meaningVi,
    options: fallbackDetail.vocabularies.map((item) => item.meaningVi),
  }),
);

export function LearningApp() {
  const [token, setToken] = useState("");
  const hasHydratedRef = useRef(false);
  const [activeTab, setActiveTab] = useState<"learn" | "quiz">("learn");
  const [wordFilter, setWordFilter] = useState<"all" | "learned" | "favorites">(
    "all",
  );
  const [topics, setTopics] = useState<Topic[]>(fallbackTopics);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [detail, setDetail] = useState<TopicDetail>(emptyDetail);
  const [learnedWords, setLearnedWords] = useState<Vocabulary[]>([]);
  const [favoriteWords, setFavoriteWords] = useState<Vocabulary[]>([]);
  const [quiz, setQuiz] = useState<QuizQuestion[]>(fallbackQuiz);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [dueReviews, setDueReviews] = useState<ReviewDue[]>([]);
  const [notice, setNotice] = useState(
    "Đang dùng dữ liệu mẫu cho tới khi backend sẵn sàng.",
  );

  const learnedPercent = useMemo(() => {
    if (!detail.vocabularies.length) return 0;
    const learned = detail.vocabularies.filter(
      (vocabulary) => vocabulary.isLearned,
    ).length;
    return Math.round((learned / detail.vocabularies.length) * 100);
  }, [detail]);

  const visibleWords = useMemo(() => {
    if (!selectedSlug) return [];
    if (wordFilter === "learned") {
      return learnedWords.filter((word) => word.topic?.slug === selectedSlug);
    }
    if (wordFilter === "favorites") {
      return favoriteWords.filter((word) => word.topic?.slug === selectedSlug);
    }
    return detail.vocabularies;
  }, [detail.vocabularies, favoriteWords, learnedWords, selectedSlug, wordFilter]);

  const selectedLearnedWords = useMemo(
    () => learnedWords.filter((word) => word.topic?.slug === selectedSlug),
    [learnedWords, selectedSlug],
  );

  const selectedFavoriteWords = useMemo(
    () => favoriteWords.filter((word) => word.topic?.slug === selectedSlug),
    [favoriteWords, selectedSlug],
  );

  useEffect(() => {
    hasHydratedRef.current = true;
    const timer = window.setTimeout(() => {
      setToken(window.localStorage.getItem("oxford_access_token") ?? "");
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    void loadTopics();
    if (token) {
      void loadDashboard();
      void loadDueReviews();
      void loadWordCollections();
    }
  }, [token]);

  useEffect(() => {
    if (!hasHydratedRef.current) return;
    if (!selectedSlug) {
      return;
    }
    void loadTopic(selectedSlug);
  }, [selectedSlug, token]);

  async function request<T>(path: string, options: RequestInit = {}) {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      try {
        const error = (await response.json()) as {
          message?: string | string[];
          error?: string;
        };
        if (Array.isArray(error.message)) {
          message = error.message.join(" ");
        } else if (error.message) {
          message = error.message;
        } else if (error.error) {
          message = error.error;
        }
      } catch {
        message = response.statusText || message;
      }
      throw new Error(message);
    }

    return response.json() as Promise<T>;
  }

  async function loadTopics() {
    try {
      const data = await request<Topic[]>(
        token ? "/topics/progress" : "/topics",
      );
      setTopics(data);
      setNotice("Đã kết nối backend.");
    } catch {
      setTopics(fallbackTopics);
    }
  }

  async function loadTopic(slug: string) {
    try {
      const data = await request<TopicDetail>(
        token ? `/topics/${slug}/vocabularies` : `/topics/${slug}`,
      );
      setDetail(data);
      await loadQuiz(data.id);
    } catch {
      setDetail(fallbackDetail);
      setQuiz(fallbackQuiz);
    }
  }

  async function loadQuiz(topicId: string) {
    if (!token) return;
    try {
      const data = await request<{ questions: QuizQuestion[] }>(
        `/topics/${topicId}/quiz/generate`,
      );
      setQuiz(data.questions);
    } catch {
      setQuiz(fallbackQuiz);
    }
  }

  async function loadDashboard() {
    try {
      const data = await request<Dashboard>(`/user/dashboard`);
      setDashboard(data);
    } catch {
      setDashboard(null);
    }
  }

  async function loadDueReviews() {
    if (!token) return;
    try {
      const data = await request<ReviewDue[]>(`/reviews/due`);
      setDueReviews(data);
    } catch {
      setDueReviews([]);
    }
  }

  async function loadWordCollections() {
    if (!token) return;
    try {
      const [learned, favorites] = await Promise.all([
        request<Vocabulary[]>("/vocabularies/learned"),
        request<Vocabulary[]>("/vocabularies/favorites"),
      ]);
      setLearnedWords(learned);
      setFavoriteWords(favorites);
    } catch {
      setLearnedWords([]);
      setFavoriteWords([]);
    }
  }

  async function gradeReview(scheduleId: string, quality: number) {
    if (!token) {
      setNotice("Cần đăng nhập để chấm điểm ôn tập.");
      return;
    }

    try {
      await request(`/reviews/${scheduleId}/grade`, {
        method: "POST",
        body: JSON.stringify({ quality }),
      });
      setNotice(`Đã lưu đánh giá ôn tập: ${quality}`);
      void loadDashboard();
      void loadDueReviews();
    } catch {
      setNotice("Không gửi được đánh giá ôn tập.");
    }
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitter = (event.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement | null;
    const form = new FormData(event.currentTarget);
    const payload = {
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
      fullName: String(form.get("fullName") || "Oxford Learner").trim(),
    };

    try {
      const path =
        submitter?.value === "register" ? "/auth/register" : "/auth/login";
      const data = await request<{ accessToken: string }>(path, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      window.localStorage.setItem("oxford_access_token", data.accessToken);
      setToken(data.accessToken);
      setSelectedSlug("");
      setDetail(emptyDetail);
      setQuiz([]);
      setAnswers({});
      setWordFilter("all");
      setNotice("Đăng nhập thành công, tiến độ sẽ được lưu.");
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Chưa đăng nhập được. Kiểm tra backend, database và tài khoản.",
      );
    }
  }

  function handleLogout() {
    window.localStorage.removeItem("oxford_access_token");
    setToken("");
    setDashboard(null);
    setDueReviews([]);
    setLearnedWords([]);
    setFavoriteWords([]);
    setWordFilter("all");
    setAnswers({});
    setQuiz([]);
    setTopics(fallbackTopics);
    setSelectedSlug("");
    setDetail(emptyDetail);
    setNotice("Đã đăng xuất khỏi phiên local.");
  }

  async function markLearned(vocabulary: Vocabulary) {
    if (!token) {
      setNotice("Cần đăng nhập để lưu tiến độ học.");
      return;
    }

    try {
      await request(`/vocabularies/${vocabulary.id}/learn`, { method: "POST" });
      setDetail((current) => ({
        ...current,
        vocabularies: current.vocabularies.map((item) =>
          item.id === vocabulary.id ? { ...item, isLearned: true } : item,
        ),
      }));
      setNotice(`Đã đánh dấu "${vocabulary.word}" là đã học.`);
      void loadDashboard();
      void loadDueReviews();
      void loadWordCollections();
    } catch {
      setNotice("Không lưu được tiến độ. Backend có thể chưa chạy.");
    }
  }

  async function toggleFavorite(vocabulary: Vocabulary) {
    if (!token) {
      setNotice("Cần đăng nhập để lưu từ yêu thích.");
      return;
    }

    try {
      const result = await request<{ isFavorite: boolean }>(
        `/vocabularies/${vocabulary.id}/favorite`,
        {
          method: "POST",
        },
      );
      setDetail((current) => ({
        ...current,
        vocabularies: current.vocabularies.map((item) =>
          item.id === vocabulary.id
            ? { ...item, isFavorite: result.isFavorite }
            : item,
        ),
      }));
      setNotice(
        result.isFavorite
          ? `Đã lưu "${vocabulary.word}" vào yêu thích.`
          : `Đã bỏ lưu "${vocabulary.word}".`,
      );
      void loadDashboard();
      void loadWordCollections();
    } catch {
      setNotice("Không cập nhật được yêu thích.");
    }
  }

  async function submitQuiz() {
    if (!token) {
      setNotice("Cần đăng nhập để nộp quiz và lưu lịch sử.");
      return;
    }

    try {
      const result = await request<{
        score: number;
        correctAnswers: number;
        totalQuestions: number;
      }>("/quiz/submit", {
        method: "POST",
        body: JSON.stringify({
          topicId: detail.id,
          duration: 0,
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            answer,
          })),
        }),
      });
      setNotice(
        `Quiz hoàn tất: ${result.correctAnswers}/${result.totalQuestions}, điểm ${Math.round(result.score)}%.`,
      );
      void loadDashboard();
    } catch {
      setNotice("Chưa nộp được quiz. Hãy kiểm tra token và backend.");
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-zinc-500">
              Oxford 3000
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">
              Vocabulary Studio
            </h1>
          </div>
          {token ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <span className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
                Đã đăng nhập
              </span>
              <button
                onClick={handleLogout}
                className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-semibold"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleAuth}
              className="grid gap-2 sm:grid-cols-[140px_1fr_1fr_auto_auto]"
            >
              <input
                name="fullName"
                placeholder="Tên"
                className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Mật khẩu"
                className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
                required
              />
              <button
                name="mode"
                value="login"
                className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white"
              >
                Đăng nhập
              </button>
              <button
                name="mode"
                value="register"
                className="h-10 rounded-md border border-zinc-300 px-4 text-sm font-semibold"
              >
                Đăng ký
              </button>
            </form>
          )}
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6">
        <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1.5fr_repeat(5,1fr)]">
            <div className="rounded-md bg-zinc-50 p-3">
              <p className="text-xs font-semibold uppercase text-zinc-500">
                Trạng thái user
              </p>
              <p className="mt-1 text-sm font-medium text-zinc-800">{notice}</p>
              <p className="mt-2 text-xs text-zinc-500">
                {token ? "Đã đăng nhập, tiến độ sẽ được lưu." : "Chưa đăng nhập."}
              </p>
            </div>
            <div className="rounded-md bg-zinc-50 p-3">
              <p className="text-xs text-zinc-500">Tiến độ chủ đề</p>
              <p className="mt-1 text-2xl font-semibold">{learnedPercent}%</p>
            </div>
            <div className="rounded-md bg-zinc-50 p-3">
              <p className="text-xs text-zinc-500">Từ trong chủ đề</p>
              <p className="mt-1 text-2xl font-semibold">
                {detail.vocabularies.length}
              </p>
            </div>
            <div className="rounded-md bg-zinc-50 p-3">
              <p className="text-xs text-zinc-500">Tổng đã học</p>
              <p className="mt-1 text-2xl font-semibold">
                {token ? learnedWords.length : "-"}
              </p>
            </div>
            <div className="rounded-md bg-zinc-50 p-3">
              <p className="text-xs text-zinc-500">Yêu thích</p>
              <p className="mt-1 text-2xl font-semibold">
                {token ? favoriteWords.length : "-"}
              </p>
            </div>
            <div className="rounded-md bg-zinc-50 p-3">
              <p className="text-xs text-zinc-500">Cần ôn</p>
              <p className="mt-1 text-2xl font-semibold">
                {token ? (dashboard?.dueReviews ?? dueReviews.length) : "-"}
              </p>
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-zinc-100">
            <div
              className="h-2 rounded-full bg-zinc-950"
              style={{ width: `${learnedPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-5 sm:px-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Chủ đề</h2>
              <span className="text-xs text-zinc-500">{topics.length}</span>
            </div>
            <div className="mt-3 space-y-1">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => {
                    setSelectedSlug(topic.slug);
                    setWordFilter("all");
                    setAnswers({});
                  }}
                  className={`w-full rounded-md border px-3 py-2 text-left text-sm transition ${selectedSlug === topic.slug ? "border-zinc-950 bg-zinc-950 text-white" : "border-transparent text-zinc-700 hover:bg-zinc-100"}`}
                >
                  <span className="block font-semibold">{topic.title}</span>
                  <span className="text-xs opacity-70">
                    {topic.learnedWords ?? 0}/{topic.totalWords} từ đã học
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold">Trạng thái</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{notice}</p>
          </div>
        </aside>

        <section className="space-y-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-zinc-500">
                  Chủ đề hiện tại
                </p>
                <h2 className="mt-1 text-2xl font-semibold">{detail.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
                  {detail.description}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
                <div className="rounded-md bg-zinc-50 p-3">
                  <p className="text-xs text-zinc-500">Tiến độ</p>
                  <p className="mt-1 text-xl font-semibold">{learnedPercent}%</p>
                </div>
                <div className="rounded-md bg-zinc-50 p-3">
                  <p className="text-xs text-zinc-500">Từ mới</p>
                  <p className="mt-1 text-xl font-semibold">
                    {detail.vocabularies.length}
                  </p>
                </div>
                <div className="rounded-md bg-zinc-50 p-3">
                  <p className="text-xs text-zinc-500">Quiz</p>
                  <p className="mt-1 text-xl font-semibold">{quiz.length}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-zinc-100">
              <div
                className="h-1.5 rounded-full bg-zinc-950"
                style={{ width: `${learnedPercent}%` }}
              />
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-zinc-200 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex rounded-md border border-zinc-200 bg-zinc-100 p-1">
                {[
                  ["learn", "Học từ"],
                  ["quiz", "Quiz"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => setActiveTab(value as "learn" | "quiz")}
                    className={`h-9 rounded px-4 text-sm font-semibold ${activeTab === value ? "bg-white text-zinc-950 shadow-sm" : "text-zinc-500"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {dashboard && (
                <div className="flex gap-3 text-sm text-zinc-600">
                  <span>{learnedWords.length} đã học</span>
                  <span>{favoriteWords.length} yêu thích</span>
                  <span>{dashboard.dueReviews} cần ôn</span>
                </div>
              )}
            </div>

            {activeTab === "learn" ? (
              <>
                {selectedSlug ? (
                  <div className="flex flex-col gap-3 border-b border-zinc-200 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="inline-flex flex-wrap gap-2">
                      {[
                        ["all", `Tất cả (${detail.vocabularies.length})`],
                        ["learned", `Đã học (${selectedLearnedWords.length})`],
                        [
                          "favorites",
                          `Yêu thích (${selectedFavoriteWords.length})`,
                        ],
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          onClick={() =>
                            setWordFilter(
                              value as "all" | "learned" | "favorites",
                            )
                          }
                          className={`h-9 rounded-md border px-3 text-sm font-semibold ${wordFilter === value ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-300 bg-white text-zinc-700"}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <span className="text-sm text-zinc-500">
                      Đang hiển thị {visibleWords.length} từ
                    </span>
                  </div>
                ) : (
                  <div className="border-b border-zinc-200 p-4">
                    <p className="text-sm font-medium text-zinc-800">
                      Chọn một chủ đề để xem danh sách từ.
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">
                      Danh mục Tất cả, Đã học và Yêu thích sẽ hiển thị theo chủ đề bạn chọn.
                    </p>
                  </div>
                )}

                <div className="divide-y divide-zinc-200">
                  {visibleWords.length === 0 && (
                    <p className="p-4 text-sm text-zinc-500">
                      Chưa có từ nào trong danh mục này.
                    </p>
                  )}
                  {visibleWords.map((vocabulary) => (
                  <article
                    key={vocabulary.id}
                    className="grid gap-4 p-4 md:grid-cols-[220px_1fr_auto]"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">
                          {vocabulary.word}
                        </h3>
                        <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                          {vocabulary.partOfSpeech}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-500">
                        {vocabulary.ipa}
                      </p>
                      <p className="mt-3 text-base font-semibold text-zinc-950">
                        {vocabulary.meaningVi}
                      </p>
                      {vocabulary.topic && (
                        <p className="mt-2 text-xs text-zinc-500">
                          {vocabulary.topic.title}
                        </p>
                      )}
                    </div>
                    <div className="rounded-md bg-zinc-50 p-3">
                      <p className="text-sm font-medium leading-6 text-zinc-800">
                        {vocabulary.exampleSentence ||
                          "Chưa có câu ví dụ chuẩn cho từ này."}
                      </p>
                      {vocabulary.exampleMeaning && (
                        <p className="mt-1 text-sm leading-6 text-zinc-500">
                          {vocabulary.exampleMeaning}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 md:flex-col">
                      <button
                        onClick={() => toggleFavorite(vocabulary)}
                        className="h-9 rounded-md border border-zinc-300 px-3 text-sm font-semibold"
                      >
                        {vocabulary.isFavorite ? "Đã lưu" : "Lưu"}
                      </button>
                      <button
                        onClick={() => markLearned(vocabulary)}
                        className={`h-9 rounded-md px-3 text-sm font-semibold ${vocabulary.isLearned ? "bg-emerald-100 text-emerald-800" : "bg-zinc-950 text-white"}`}
                      >
                        {vocabulary.isLearned ? "Đã học" : "Đánh dấu"}
                      </button>
                    </div>
                  </article>
                  ))}
                </div>
              </>
            ) : (
              selectedSlug ? (
                <div className="grid gap-4 p-4 xl:grid-cols-[1fr_320px]">
                <div className="space-y-3">
                  {quiz.map((question, index) => (
                    <label
                      key={question.id}
                      className="block rounded-lg border border-zinc-200 bg-zinc-50 p-4"
                    >
                      <span className="text-xs font-semibold uppercase text-zinc-500">
                        Câu {index + 1} · {question.type}
                      </span>
                      <span className="mt-2 block text-lg font-semibold">
                        {question.prompt}
                      </span>
                      {question.options?.length ? (
                        <select
                          value={answers[question.id] ?? ""}
                          onChange={(event) =>
                            setAnswers((current) => ({
                              ...current,
                              [question.id]: event.target.value,
                            }))
                          }
                          className="mt-3 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm"
                        >
                          <option value="">Chọn đáp án</option>
                          {question.options.map((option) => {
                            const value =
                              typeof option === "string" ? option : option.id;
                            const label =
                              typeof option === "string" ? option : option.word;
                            return (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            );
                          })}
                        </select>
                      ) : (
                        <input
                          value={answers[question.id] ?? ""}
                          onChange={(event) =>
                            setAnswers((current) => ({
                              ...current,
                              [question.id]: event.target.value,
                            }))
                          }
                          className="mt-3 h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm"
                          placeholder="Nhập câu trả lời"
                        />
                      )}
                    </label>
                  ))}
                </div>

                <aside className="space-y-4">
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                    <h3 className="text-sm font-semibold">Nộp bài</h3>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      Đã trả lời {Object.keys(answers).length}/{quiz.length} câu.
                    </p>
                    <button
                      onClick={submitQuiz}
                      className="mt-4 h-10 w-full rounded-md bg-zinc-950 text-sm font-semibold text-white"
                    >
                      Nộp quiz
                    </button>
                  </div>

                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Ôn tập hôm nay</h3>
                      <span className="text-xs text-zinc-500">
                        {dueReviews.length}
                      </span>
                    </div>
                    <div className="mt-3 space-y-3">
                      {dueReviews.length > 0 ? (
                        dueReviews.slice(0, 4).map((review) => (
                          <div
                            key={review.id}
                            className="rounded-md bg-white p-3"
                          >
                            <p className="font-semibold">
                              {review.vocabulary.word}
                            </p>
                            <p className="text-sm text-zinc-500">
                              {review.vocabulary.meaningVi}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {[5, 4, 3, 2, 1, 0].map((quality) => (
                                <button
                                  key={quality}
                                  onClick={() => gradeReview(review.id, quality)}
                                  className="rounded-md border border-zinc-300 px-2 py-1 text-xs"
                                >
                                  {quality}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-500">
                          Không có mục ôn tập nào cần làm hôm nay.
                        </p>
                      )}
                    </div>
                  </div>
                </aside>
              </div>
              ) : (
                <div className="p-4">
                  <p className="text-sm font-medium text-zinc-800">
                    Chọn một chủ đề để bắt đầu quiz.
                  </p>
                  <p className="mt-1 text-sm text-zinc-500">
                    Quiz sẽ được tạo theo chủ đề bạn chọn ở cột bên trái.
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
