/** 글쓰기·글 수정에서 함께 쓰는 입력 양식 */
import { useState, type FormEvent } from 'react';
import { useAuth } from '../../auth/useAuth';
import { canWriteCategory, type Category } from '../../services';
import { buttonClass, categoryLabels, ErrorMessage, errorText } from '../../components/ui';

export interface PostFormValues {
  title: string;
  body: string;
  category: Category;
}

export const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-800 dark:focus:ring-blue-900';

export function PostForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: PostFormValues;
  submitLabel: string;
  onSubmit: (values: PostFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const { user } = useAuth();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [body, setBody] = useState(initial?.body ?? '');
  const [category, setCategory] = useState<Category>(initial?.category ?? 'research');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // 공지(notice)는 관리자에게만 선택지로 보입니다.
  const allowed = (Object.keys(categoryLabels) as Category[]).filter((c) => canWriteCategory(user, c));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError('제목과 본문을 모두 입력해 주세요.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onSubmit({ title: title.trim(), body, category });
    } catch (err) {
      setError(errorText(err));
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium">
          카테고리
        </label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value as Category)} className={inputClass}>
          {allowed.map((c) => (
            <option key={c} value={c}>
              {categoryLabels[c]}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          제목
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          className={inputClass}
          placeholder="제목을 입력하세요"
        />
      </div>
      <div>
        <label htmlFor="body" className="mb-1 block text-sm font-medium">
          본문
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          maxLength={20000}
          className={inputClass}
          placeholder={'내용을 입력하세요.\n자료 파일은 Google Drive 등에 올린 뒤 링크 주소를 붙여 넣어 주세요.'}
        />
        <p className="mt-1 text-xs text-slate-500">일반 텍스트로 저장되며, 줄바꿈은 그대로 표시됩니다.</p>
      </div>
      {error && <ErrorMessage message={error} />}
      <div className="flex gap-2">
        <button type="submit" className={buttonClass.primary} disabled={busy}>
          {busy ? '저장 중…' : submitLabel}
        </button>
        <button type="button" className={buttonClass.secondary} onClick={onCancel} disabled={busy}>
          취소
        </button>
      </div>
    </form>
  );
}
