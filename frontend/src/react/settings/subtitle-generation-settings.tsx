/* 自动中文字幕队列。开关、数量和正在生成的作品从 `/api/subtitles/generation` 来。 */
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { SettingsRow } from '@/components/application/settings/settings-rows';
import { Button } from '@/components/base/buttons/button';
import { Switch } from '@/components/base/switch/switch';

import { apiGet, apiSend, errorMessage } from '../../api';
import { queryClient } from '../query';
import { ErrorText, Help, Rows, Section, Stack } from './section';
import { useAction } from './use-action';

const KEY = ['subtitles', 'generation'] as const;
const URL = '/api/subtitles/generation';

interface GenerationItem { id: number; name: string; status: string; message: string }
interface GenerationSnapshot {
  enabled: boolean;
  notice: string;
  unavailable: string;
  counts: { queued: number; running: number; failed: number; ready: number; skipped: number };
  current: GenerationItem | null;
  queued: GenerationItem[];
  failed: GenerationItem[];
  skipped: GenerationItem[];
}

const load = (signal: AbortSignal) => apiGet<GenerationSnapshot>(URL, signal);

function AssetLink({ item }: { item: GenerationItem }) {
  return <a className="min-w-0 flex-1 wrap-anywhere text-body-medium text-text-primary" href={`/assets/${item.id}`}>{item.name}</a>;
}

export function SubtitleGenerationSettings({ active, receipt }: { active: boolean; receipt(message: string): void }) {
  const query = useQuery({
    queryKey: KEY, queryFn: ({ signal }) => load(signal), enabled: active,
    refetchInterval: active ? 4000 : false,
  });
  const action = useAction();
  const data = query.data;
  useEffect(() => {
    if (!active || window.location.hash !== '#subtitleGeneration') return;
    document.getElementById('subtitleGeneration')?.scrollIntoView({ block: 'start' });
  }, [active, data]);
  const save = (snapshot: GenerationSnapshot, message: string) => {
    queryClient.setQueryData(KEY, snapshot);
    receipt(message);
  };
  const post = (key: string, path: string, body: unknown, message: string) => {
    void action.run(key, (signal) => apiSend<GenerationSnapshot>(path, body, 'POST', signal), (snapshot) => save(snapshot, message));
  };
  const counts = data?.counts;
  return (
    <Section id="subtitleGeneration" title="中文字幕">
      <Rows>
        <SettingsRow label="自动生成" description="缺中文字幕的日语影片排队转写并翻译。关闭后当前这一部做完就停。">
          <Switch aria-label="自动生成中文字幕" isSelected={!!data?.enabled} isDisabled={!data || !!action.busy}
            onChange={(value) => post('enabled', URL, { enabled: value }, value ? '已打开中文字幕生成' : '已关闭中文字幕生成')} />
        </SettingsRow>
      </Rows>
      <Stack divided>
        {query.isError ? <ErrorText>{errorMessage(query.error)}</ErrorText> : null}
        {action.error ? <ErrorText>{action.error}</ErrorText> : null}
        {data?.notice ? <Help role="status">{data.notice}</Help> : null}
        {data?.unavailable ? <Help role="status">{data.unavailable}</Help> : null}
        {counts ? <Help role="status">排队 {counts.queued} · 生成中 {counts.running} · 失败 {counts.failed} · 已完成 {counts.ready} · 已忽略 {counts.skipped}</Help> : null}
        {data?.current ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-body-2-regular text-text-secondary">正在生成</span>
            <AssetLink item={data.current} />
            <Button size="small" variant="secondary" disabled={!!action.busy} onClick={() => post(`ignore-${data.current!.id}`, `${URL}/ignore`, { id: data.current!.id }, '已忽略正在生成的作品')}>忽略</Button>
          </div>
        ) : <Help>当前没有正在生成的作品。</Help>}
        <ItemList title="排队" items={data?.queued || []} empty="队列是空的。" action="忽略" busy={action.busy}
          onAction={(item) => post(`ignore-${item.id}`, `${URL}/ignore`, { id: item.id }, '已忽略')} />
        <ItemList title="失败" items={data?.failed || []} empty="没有失败的作品。" action="重试" busy={action.busy}
          onAction={(item) => post(`retry-${item.id}`, `${URL}/retry`, { id: item.id }, '已重新排队')} />
        <ItemList title="已忽略" items={data?.skipped || []} empty="没有已忽略的作品。" action="重试" busy={action.busy}
          onAction={(item) => post(`retry-${item.id}`, `${URL}/retry`, { id: item.id }, '已重新排队')} />
      </Stack>
    </Section>
  );
}

function ItemList({ title, items, empty, action, busy, onAction }: {
  title: string; items: GenerationItem[]; empty: string; action: string; busy: string;
  onAction(item: GenerationItem): void;
}) {
  return (
    <div>
      <p className="text-body-medium text-text-primary">{title}</p>
      {items.length ? (
        <ul className="mt-1 flex flex-col">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center gap-2 border-t border-separator-border py-2">
              <AssetLink item={item} />
              {item.message ? <span className="text-body-2-regular text-text-secondary">{item.message}</span> : null}
              <Button size="small" variant="secondary" disabled={!!busy} onClick={() => onAction(item)}>{action}</Button>
            </li>
          ))}
        </ul>
      ) : <Help>{empty}</Help>}
    </div>
  );
}
