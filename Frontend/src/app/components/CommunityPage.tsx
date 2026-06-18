import { type FormEvent, useState } from "react";
import { ArrowLeft, MessageSquare, Plus, Send, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useForum } from "../hooks/useForum";
import type { ForumCommentaire } from "../types";

function formatDate(isoString: string): string {
  // MySQL returns "2024-06-10 10:30:00" without timezone — force UTC to avoid 2h offset
  const utcString = isoString.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(isoString)
    ? isoString
    : `${isoString.replace(" ", "T")}Z`;
  const date = new Date(utcString);
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMin < 1) return "À l'instant";
  if (diffMin < 60) return `il y a ${diffMin} min`;
  if (diffMin < 1440) return `il y a ${Math.floor(diffMin / 60)} h`;
  return date.toLocaleDateString("fr-FR");
}

function AuthorAvatar({ pseudo, size = "sm" }: Readonly<{ pseudo: string; size?: "sm" | "md" }>) {
  const colors = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#84cc16", "#06b6d4"];
  const color = colors[(pseudo.codePointAt(0) ?? 0) % colors.length];
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      style={{ backgroundColor: color }}
    >
      {pseudo.slice(0, 2).toUpperCase()}
    </div>
  );
}

// ─── Arbre de commentaires ─────────────────────────────────────────────────

interface CommentNode extends ForumCommentaire {
  replies: CommentNode[];
}

function buildCommentTree(flatComments: ForumCommentaire[]): CommentNode[] {
  const nodeMap = new Map<number, CommentNode>();
  const roots: CommentNode[] = [];

  for (const c of flatComments) nodeMap.set(c.id, { ...c, replies: [] });

  for (const c of flatComments) {
    const node = nodeMap.get(c.id);
    if (!node) continue;
    if (c.id_commentaires_parent === null) {
      roots.push(node);
    } else {
      nodeMap.get(c.id_commentaires_parent)?.replies.push(node);
    }
  }
  return roots;
}

function CommentItem({
  node, depth, onReply,
}: Readonly<{
  node: CommentNode;
  depth: number;
  onReply: (parentId: number) => void;
}>) {
  return (
    <div className={`${depth > 0 ? "ml-6 border-l-2 border-slate-700 pl-4" : ""}`}>
      <div className="flex gap-3 py-3">
        <AuthorAvatar pseudo={node.auteur_pseudo} />
        <div className="flex-1">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm font-semibold text-slate-200">{node.auteur_pseudo}</span>
            <span className="text-xs text-slate-500">{formatDate(node.created_at)}</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">{node.contenu}</p>
          {depth < 2 && (
            <button
              onClick={() => onReply(node.id)}
              className="mt-1 text-xs text-slate-500 hover:text-indigo-400 transition-colors"
            >
              Répondre
            </button>
          )}
        </div>
      </div>
      {node.replies.map((reply) => (
        <CommentItem key={reply.id} node={reply} depth={depth + 1} onReply={onReply} />
      ))}
    </div>
  );
}

// ─── Vue détail d'une publication ──────────────────────────────────────────

function PublicationDetail({
  publication, commentaires, onBack, onComment, onDelete, currentUserBackendId,
}: Readonly<{
  publication: ReturnType<typeof useForum>["selectedPublication"];
  commentaires: ReturnType<typeof useForum>["commentaires"];
  onBack: () => void;
  onComment: (contenu: string, parentId: number | null) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  currentUserBackendId: number;
}>) {
  const [commentInput, setCommentInput] = useState("");
  const [replyToId, setReplyToId] = useState<number | null>(null);

  if (!publication) return null;
  const tree = buildCommentTree(commentaires);
  const isOwner = publication.id_utilisateurs === currentUserBackendId;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = commentInput.trim();
    if (!trimmed) return;
    await onComment(trimmed, replyToId);
    setCommentInput("");
    setReplyToId(null);
  };

  return (
    <div className="space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft size={16} /> Retour au forum
      </button>

      {/* Publication */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <AuthorAvatar pseudo={publication.auteur_pseudo} size="md" />
            <div>
              <p className="font-semibold text-slate-200">{publication.auteur_pseudo}</p>
              <p className="text-xs text-slate-500">{formatDate(publication.created_at)}</p>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={() => void onDelete(publication.id)}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        {publication.libelle && (
          <h2 className="text-xl font-bold text-slate-100 mb-2">{publication.libelle}</h2>
        )}
        <p className="text-slate-300 leading-relaxed">{publication.contenu}</p>
      </div>

      {/* Commentaires */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-slate-100 font-semibold mb-4">
          Commentaires ({publication.nb_commentaires})
        </h3>
        {tree.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">
            Soyez le premier à commenter.
          </p>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {tree.map((node) => (
              <CommentItem key={node.id} node={node} depth={0} onReply={setReplyToId} />
            ))}
          </div>
        )}

        {/* Formulaire de commentaire */}
        <form onSubmit={(e) => void handleSubmit(e)} className="mt-5 flex flex-col gap-2">
          {replyToId !== null && (
            <div className="flex items-center gap-2 text-xs text-indigo-400">
              <span>En réponse à un commentaire</span>
              <button type="button" onClick={() => setReplyToId(null)} className="underline text-slate-500">
                Annuler
              </button>
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Écrire un commentaire..."
              className="flex-1 px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-700 disabled:text-slate-600 text-white rounded-xl transition-all"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Vue liste du forum ────────────────────────────────────────────────────

function NewPublicationForm({ onSubmit, onCancel }: Readonly<{
  onSubmit: (libelle: string | null, contenu: string) => Promise<void>;
  onCancel: () => void;
}>) {
  const [libelle, setLibelle] = useState("");
  const [contenu, setContenu] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contenu.trim()) return;
    await onSubmit(libelle.trim() || null, contenu.trim());
    setLibelle("");
    setContenu("");
  };

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="bg-slate-800 border border-indigo-500/30 rounded-xl p-5 space-y-3"
    >
      <input
        type="text"
        value={libelle}
        onChange={(e) => setLibelle(e.target.value)}
        placeholder="Titre (optionnel)"
        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-indigo-500 text-sm transition-all"
      />
      <textarea
        value={contenu}
        onChange={(e) => setContenu(e.target.value)}
        placeholder="Quoi de neuf ? Partagez avec la communauté..."
        rows={3}
        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:border-indigo-500 text-sm transition-all resize-none"
      />
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
          Annuler
        </button>
        <button
          type="submit"
          disabled={!contenu.trim()}
          className="px-5 py-2 bg-indigo-500 hover:bg-indigo-400 disabled:bg-slate-700 disabled:text-slate-600 text-white text-sm font-medium rounded-xl transition-all"
        >
          Publier
        </button>
      </div>
    </form>
  );
}

// ─── Point d'entrée ────────────────────────────────────────────────────────

export function CommunityPage() {
  const { user } = useAuth();
  const {
    publications, selectedPublication, commentaires,
    loading, error,
    selectPublication, clearSelection,
    createPublication, createCommentaire, deletePublication,
  } = useForum(user);

  const [showNewForm, setShowNewForm] = useState(false);

  const handleCreatePublication = async (libelle: string | null, contenu: string) => {
    await createPublication(libelle, contenu);
    setShowNewForm(false);
  };

  if (selectedPublication) {
    return (
      <PublicationDetail
        publication={selectedPublication}
        commentaires={commentaires}
        onBack={clearSelection}
        onComment={createCommentaire}
        onDelete={deletePublication}
        currentUserBackendId={1}
      />
    );
  }

  return (
    <div className="space-y-5 max-w-3xl">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 mb-1">Forum Communautaire</h1>
          <p className="text-slate-400 text-sm">
            {publications.length} publication{publications.length !== 1 ? "s" : ""}
          </p>
        </div>
        {!showNewForm && (
          <button
            onClick={() => setShowNewForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus size={16} /> Nouvelle publication
          </button>
        )}
      </div>

      {showNewForm && (
        <NewPublicationForm
          onSubmit={handleCreatePublication}
          onCancel={() => setShowNewForm(false)}
        />
      )}

      {/* États */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Liste des publications */}
      {publications.length === 0 && loading === false && (
        <div className="text-center py-16 text-slate-500">
          <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aucune publication pour l'instant.</p>
          <p className="text-sm mt-1">Soyez le premier à partager !</p>
        </div>
      )}

      <div className="space-y-3">
        {publications.map((pub) => (
          <button
            key={pub.id}
            onClick={() => void selectPublication(pub)}
            className="w-full text-left bg-slate-800 border border-slate-700 hover:border-slate-600 hover:-translate-y-0.5 rounded-xl p-5 transition-all duration-150 group"
          >
            <div className="flex items-start gap-4">
              <AuthorAvatar pseudo={pub.auteur_pseudo} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                    {pub.auteur_pseudo}
                  </span>
                  <span className="text-xs text-slate-500 shrink-0">{formatDate(pub.created_at)}</span>
                </div>
                {pub.libelle && (
                  <p className="text-sm font-semibold text-indigo-400 mb-1">{pub.libelle}</p>
                )}
                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{pub.contenu}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 ml-14 text-xs text-slate-500">
              <MessageSquare size={12} />
              <span>{pub.nb_commentaires} commentaire{pub.nb_commentaires === 1 ? "" : "s"}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
