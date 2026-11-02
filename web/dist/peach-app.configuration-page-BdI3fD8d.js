(function() {
	try {
		var e = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, t = new e.Error().stack;
		t && (e._sentryDebugIds = e._sentryDebugIds || {}, e._sentryDebugIds[t] = "58c712d9-b23e-4cd5-8ffc-45ca368c7bd4", e._sentryDebugIdIdentifier = "sentry-dbid-58c712d9-b23e-4cd5-8ffc-45ca368c7bd4");
	} catch {}
})();
import { AnimatedItems as e, Cell as t, ChartBackground as n, ChartContainer as r, ChartLegend as i, ChartLegendContent as a, ChartTip as o, ChartTooltip as s, ChartTooltipContent as c, Curve as l, DATA_ITEM_GRAPHICAL_ITEM_ID_ATTRIBUTE_NAME as u, DATA_ITEM_INDEX_ATTRIBUTE_NAME as d, DefaultZIndexes as f, EvilBarChart as p, LabelList as m, LabelListFromLabelProp as h, Layer as g, LoadingIndicator as _, PolarChart as v, PolarLabelContextProvider as y, PolarLabelListContextProvider as b, RegisterGraphicalItemId as x, Sector as S, SetPolarGraphicalItem as C, SetPolarLegendPayload as w, SetTooltipEntrySettings as T, Shape as ee, TIP_SWATCH as te, Text as ne, ZIndexLayer as re, adaptEventsOfChild as ie, arrayTooltipSearcher as ae, createSelector as oe, defaultPolarChartProps as se, findAllByType as ce, get as le, getClassNameFromUnknown as ue, getColorsCount as de, getMaxRadius as fe, getPercentValue as pe, getTooltipNameProp as me, getValueByDataKey as he, interpolate as ge, isNumber as _e, matchAppend as ve, mathSign as ye, polarToCartesian as be, resolveDefaultProps as xe, selectActiveTooltipDataKey as Se, selectActiveTooltipGraphicalItemId as Ce, selectActiveTooltipIndex as we, selectChartDataAndAlwaysIgnoreIndexes as Te, selectChartOffsetInternal as Ee, selectUnfilteredPolarItems as De, svgPropertiesNoEvents as Oe, svgPropertiesNoEventsFromUnknown as ke, tone as Ae, useAnimationCallbacks as je, useAppSelector as Me, useMouseClickItemDispatch as Ne, useMouseEnterItemDispatch as Pe, useMouseLeaveItemDispatch as Fe, usePolarChartLayout as Ie } from "./peach-app.chart-tip-CRxYp6KT.js";
import { $2ec61d1d4f780267$export$a8a3e93435678ff9 as Le, $3a442827418ebe87$export$eb2fcfdbd7ba97d4 as Re, $542a13ca2fa5b484$export$5b6b19405a83ff9d as ze, $72abaeab4d80592f$export$78efe591171d7d45 as Be, $bd263d78e9bf3c56$export$f5c9f3c2c4054eec as Ve, $ea3928288112382f$export$439d29a4e110a164 as He, $f2ff30fde7b014be$export$3ddf2d174ce01153 as Ue, $fe21c36db05242bb$export$a98f0dcb43a68a25 as We, $fe21c36db05242bb$export$d7b12c4107be0d61 as Ge, ACCENTS as Ke, ApiError as qe, Button as E, ButtonLink as Je, CLOUD_LOCATIONS as Ye, CLOUD_PROXY_HELP as Xe, CONFIGURATION_KEY as Ze, CONFIGURATION_URL as Qe, CREDENTIAL_STATE as $e, Checkbox as D, Chip as et, Disclosure as O, ENTRY_LINKS_HELP as tt, ENTRY_LINKS_HINT as nt, EmptyState as rt, ErrorText as k, ExternalLink as A, FEED_SCHEDULE_KEY as it, FOLLOW_CREDENTIALS_KEY as at, FOLLOW_INITIAL_RANGE_OPTIONS as ot, FOLLOW_SCHEDULE_KEY as st, Fact as j, FactList as ct, FieldLabel as lt, Footer as M, Help as N, HintText as ut, Input as P, LIBRARY_FOLDER_HELP as dt, LIBRARY_PROCESSING_KEY as ft, Label as pt, LinkButton as mt, LoadingDots as ht, M6 as gt, MEDIA_PROCESSING_KEY as _t, MEDIA_PROCESSING_URL as vt, MEDIA_SOURCE_ICONS as yt, MENU_POPOVER_SURFACE as bt, Note as F, PICK_FOLDER_URL as xt, POLICY_COLUMNS as St, POLICY_COVER_NOTE as Ct, POLICY_MATRIX as wt, POLICY_SUMMARY as Tt, PathLine as Et, PillTabList as Dt, Progress as Ot, Rows as I, SEGMENT as kt, SEGMENTED_TRACK as At, SETTINGS_KEY as jt, SETTINGS_URL as Mt, Section as L, SectionSkeleton as Nt, SegmentedRadioGroup as Pt, Select as Ft, Select$1 as R, SelectItem as z, SettingsCard as It, SettingsRow as B, SiteLabel as Lt, SourceLabel as Rt, SourceMark as zt, Stack as V, StatusLabel as H, Switch as U, THUMBNAIL_JOBS_KEY as Bt, TaskCenterLink as Vt, TextField as Ht, TextFieldContext as Ut, __toESM as Wt, animate as Gt, apiGet as W, apiSend as G, appSettingsStore as Kt, boundedPreference as qt, busyProps as K, cardClass as Jt, cloudProxySkeleton as Yt, clsx as Xt, cn as Zt, confirmModal as Qt, credentialDone as $t, credentialsSkeleton as en, cx as tn, errorMessage as q, fetchConfiguration as nn, fetchCredentials as rn, fetchFeedSchedule as an, fetchFollowSchedule as on, fetchLibraryProcessing as sn, fetchMediaProcessing as cn, fetchSettings as ln, fetchThumbnailJobs as un, fmtSize as J, indexersSkeleton as dn, javBrowserSkeleton as fn, momentText as pn, motion as mn, overlayHost as hn, peachHistory$1 as gn, previewLibraryColor as _n, processingActive as vn, providerIcon as yn, queryClient as bn, randomId as xn, rememberShape as Sn, require_jsx_runtime as Cn, require_react as wn, restartEffectText as Tn, saveCredential as En, schedulePollInterval as Dn, settingsPath as On, shellNavigate as kn, sortCx as An, sourceDefaultCost as jn, useAction as Y, useClientUpdates as Mn, useLibraryTints as Nn, useMutation as Pn, useQuery as X, useReducedMotion as Fn, useRunSchedule as In, useSaveFollowSchedule as Ln, useSaveSettings as Rn, useSaveThumbnailMode as zn } from "./peach-app.js";
import { CodeBlock as Bn } from "./peach-app.code-block-CyDva4Ms.js";
import { FolderField as Vn, FolderFieldLine as Hn, FolderRow as Un, MEDIA_SOURCES as Wn, MediaReadPolicy as Gn, MediaReadPolicyHelp as Kn, SourceSelect as qn, isCloudSource as Jn, sourceMark as Yn, useFolderRows as Xn } from "./peach-app.folder-rows-BWBfTyUD.js";
import { ConnectionStatus as Zn } from "./peach-app.connection-status-DI6kgn3i.js";
import { SourceIcon as Qn } from "./peach-app.source-view-DalWfDkm.js";
// src/react/settings/configuration-panel.ts
var Z = /* @__PURE__ */ Wt(wn(), 1), $n = "flex flex-col gap-6";
function er(e) {
	return e ? {
		className: e.active ? `${$n} ui-board-group-active` : $n,
		"data-board-group": String(e.index),
		id: e.id,
		role: "tabpanel",
		"aria-labelledby": e.labelledBy
	} : { className: $n };
}
// src/react/settings/userscript-probe.ts
function tr() {
	let e = (0, Z.useRef)(null), [t, n] = (0, Z.useState)(0), [r, i] = (0, Z.useState)("checking");
	return (0, Z.useEffect)(() => {
		let t = xn(), n = !1, r = e.current, a, o = () => {
			n = !0, clearInterval(u), i("missing");
		}, s = () => {
			n || (clearTimeout(a), a = setTimeout(o, 3e3), c());
		}, c = () => e.current?.contentWindow?.postMessage({
			type: "peach-userscript:probe",
			nonce: t
		}, window.location.origin), l = (r) => {
			!n && r.source === e.current?.contentWindow && r.origin === window.location.origin && r.data?.type === "peach-userscript:ready" && r.data.nonce === t && r.data.protocol === 1 && typeof r.data.version == "string" && /^\d{1,5}\.\d{1,5}\.\d{1,5}$/.test(r.data.version) && typeof r.data.paired == "boolean" && (n = !0, clearInterval(u), clearTimeout(a), i({
				version: r.data.version,
				paired: r.data.paired
			}));
		};
		window.addEventListener("message", l);
		let u = setInterval(c, 250);
		return a = setTimeout(o, 15e3), r?.addEventListener("load", s), r?.contentDocument?.readyState === "complete" && r.contentDocument.URL !== "about:blank" && s(), c(), () => {
			clearInterval(u), clearTimeout(a), r?.removeEventListener("load", s), window.removeEventListener("message", l);
		};
	}, [t]), {
		frame: e,
		attempt: t,
		status: r,
		retry: () => {
			r !== "checking" && (i("checking"), n((e) => e + 1));
		}
	};
}
// src/react/settings/userscript-status.tsx
var Q = Cn();
function nr(e, t) {
	let n = e.split(".").map(Number), r = t.split(".").map(Number);
	for (let e = 0; e < 3; e++) if (n[e] !== r[e]) return n[e] > r[e];
	return !0;
}
function rr({ enabled: e, release: t }) {
	let { frame: n, attempt: r, status: i, retry: a } = tr(), o = typeof i == "object", s = o && !nr(i.version, t.minimum_version), c = o && !nr(i.version, t.version), l = i === "checking" ? "progress" : i === "missing" ? "neutral" : s || c || !i.paired ? "warning" : "success", u = i === "checking" ? "检测中" : i === "missing" ? "未检测到" : s ? "需更新" : c ? "可更新" : i.paired ? "已连接" : "待配对", d = i === "checking" ? "checking" : i === "missing" ? "missing" : s ? "required" : c ? "available" : i.paired ? e ? "enabled" : "disabled" : "unpaired";
	return /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)("iframe", {
		ref: n,
		title: "Peach 用户脚本检测",
		hidden: !0,
		src: "/integrations/peach-userscript-bridge"
	}, r), /* @__PURE__ */ (0, Q.jsxs)("div", {
		"aria-live": "polite",
		"data-userscript-status": "",
		className: Jt({
			variant: "raised",
			bordered: "line",
			className: "flex flex-col gap-3"
		}),
		children: [
			/* @__PURE__ */ (0, Q.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, Q.jsx)("span", {
					className: "text-body-medium text-text-primary",
					children: "Peach 用户脚本"
				}), /* @__PURE__ */ (0, Q.jsx)(Zn, {
					tone: l,
					children: /* @__PURE__ */ (0, Q.jsx)("span", {
						"data-copy-key": `userscript.${d}.status`,
						children: u
					})
				})]
			}),
			o ? /* @__PURE__ */ (0, Q.jsxs)("p", {
				"data-copy-key": "userscript.installed.version",
				className: "text-body-regular text-text-secondary",
				children: ["用户脚本 v", i.version]
			}) : null,
			/* @__PURE__ */ (0, Q.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, Q.jsx)("span", {
					className: "text-body-regular text-text-secondary",
					children: "浏览器添加"
				}), /* @__PURE__ */ (0, Q.jsx)(H, {
					tone: e ? "success" : "neutral",
					children: /* @__PURE__ */ (0, Q.jsx)("span", {
						"data-copy-key": `userscript.adding.${e ? "enabled" : "disabled"}`,
						children: e ? "已启用" : "未启用"
					})
				})]
			}),
			/* @__PURE__ */ (0, Q.jsx)("p", {
				"data-copy-key": `userscript.${d}.message`,
				className: "text-caption-1-regular text-text-secondary",
				children: i === "checking" ? "正在检测当前浏览器的用户脚本。" : i === "missing" ? "确认脚本已启用并更新至最新版。Chrome 还需在 Tampermonkey 扩展详情中开启「允许用户脚本」或开发者模式，并允许访问当前 Peach 站点；刷新页面后重新检测。" : s ? `请更新至 v${t.minimum_version} 或更高版本。` : c ? `用户脚本 v${t.version} 可更新。` : i.paired ? e ? "可在支持的站点直接加入 Peach 馆藏。" : "启用浏览器添加后，可在支持的站点直接加入 Peach 馆藏。" : "生成令牌后复制配对信息，在用户脚本设置中粘贴并保存。"
			}),
			/* @__PURE__ */ (0, Q.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					i === "missing" || s || c ? /* @__PURE__ */ (0, Q.jsx)(A, {
						href: t.install_url,
						children: /* @__PURE__ */ (0, Q.jsx)("span", {
							"data-copy-key": `userscript.${i === "missing" ? "install" : "update"}.action`,
							children: s || c ? "更新用户脚本" : "安装 Peach 用户脚本"
						})
					}) : null,
					i === "missing" ? /* @__PURE__ */ (0, Q.jsx)(A, {
						href: "https://www.tampermonkey.net/faq.php#Q209",
						children: "Tampermonkey 权限设置说明"
					}) : null,
					/* @__PURE__ */ (0, Q.jsx)(E, {
						variant: "secondary",
						type: "button",
						...K(i === "checking"),
						onClick: a,
						children: "重新检测"
					})
				]
			})
		]
	})] });
}
// src/react/settings/jav-browser-settings.tsx
var ir = "/api/configuration/jav-browser";
function ar({ receipt: e, refreshKey: t }) {
	let n = X({
		queryKey: ["jav-browser-settings", t],
		queryFn: ({ signal: e }) => W(ir, e),
		refetchOnMount: "always",
		refetchOnWindowFocus: "always"
	});
	return n.error && !n.data ? /* @__PURE__ */ (0, Q.jsx)(k, { children: q(n.error) }) : n.isFetching && !n.data ? /* @__PURE__ */ (0, Q.jsx)(Nt, {
		label: "正在读取浏览器添加设置",
		html: fn
	}) : n.data ? /* @__PURE__ */ (0, Q.jsx)(or, {
		initial: n.data,
		receipt: e
	}) : null;
}
function or({ initial: e, receipt: t }) {
	let [n, r] = (0, Z.useState)(e), [i, a] = (0, Z.useState)(e.provider), [o, s] = (0, Z.useState)(""), c = Y();
	(0, Z.useEffect)(() => {
		Sn("javBrowser", {
			enabled: e.enabled,
			ready: e.providers.some((t) => t.key === e.provider && t.configured && t.target)
		}), r(e), a((t) => e.providers.some((e) => e.key === t) ? t : e.provider), e.enabled || s("");
	}, [e]);
	let l = (e) => {
		c.run(e, (t) => G(ir, {
			action: e,
			provider: i
		}, "POST", t), (n) => {
			let { token: i = "", ...o } = n;
			r(o), a(o.provider), s(i), t(e === "disable" ? "已关闭浏览器添加" : "已生成专用令牌");
		});
	}, u = n.providers.some((e) => e.key === i && e.configured && e.target);
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		guide: "browser",
		title: "浏览器添加 JAV",
		children: [/* @__PURE__ */ (0, Q.jsxs)(V, { children: [/* @__PURE__ */ (0, Q.jsxs)("div", {
			className: "flex min-w-0 flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, Q.jsx)(rr, {
					enabled: n.enabled,
					release: n.userscript
				}),
				/* @__PURE__ */ (0, Q.jsxs)("div", {
					className: "flex flex-col gap-1",
					children: [/* @__PURE__ */ (0, Q.jsx)(lt, { children: "浏览器添加的下载渠道" }), /* @__PURE__ */ (0, Q.jsx)(R, {
						"aria-label": "浏览器添加的下载渠道",
						selectedKey: i || null,
						placeholder: "暂无可用渠道",
						onSelectionChange: (e) => {
							e !== null && a(String(e));
						},
						isDisabled: !n.providers.length || !!c.busy,
						children: n.providers.map((e) => /* @__PURE__ */ (0, Q.jsx)(z, {
							id: e.key,
							textValue: e.label,
							children: /* @__PURE__ */ (0, Q.jsx)(Rt, {
								source: e.key,
								label: e.label
							})
						}, e.key))
					})]
				}),
				u ? null : /* @__PURE__ */ (0, Q.jsx)(N, { children: "请在媒体库中添加支持云下载的网盘，并配置账号与目标目录。" }),
				n.problems?.map((e) => /* @__PURE__ */ (0, Q.jsx)(N, { children: e }, e)),
				n.enabled && n.active_provider && !n.providers.some((e) => e.key === n.active_provider) ? /* @__PURE__ */ (0, Q.jsx)(N, { children: "已启用的下载渠道不可用，请选择渠道并更新令牌。" }) : null,
				/* @__PURE__ */ (0, Q.jsx)(P, {
					label: "Peach 地址",
					value: window.location.origin,
					isReadOnly: !0,
					autoComplete: "off"
				}),
				o ? /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [
					/* @__PURE__ */ (0, Q.jsx)(P, {
						label: "浏览器添加专用令牌",
						type: "password",
						value: o,
						isReadOnly: !0,
						autoComplete: "new-password"
					}),
					/* @__PURE__ */ (0, Q.jsx)("div", { children: /* @__PURE__ */ (0, Q.jsx)(E, {
						variant: "secondary",
						type: "button",
						onClick: () => {
							c.run("copy", async () => navigator.clipboard.writeText(JSON.stringify({
								peach_pairing: 1,
								base: window.location.origin,
								token: o
							})), () => t("已复制配对信息"));
						},
						...K(c.busy === "copy"),
						children: "复制配对信息"
					}) }),
					/* @__PURE__ */ (0, Q.jsx)(N, { children: "在用户脚本设置的「Peach 地址」中粘贴配对信息，即可填好地址与令牌。" })
				] }) : null
			]
		}), c.error ? /* @__PURE__ */ (0, Q.jsx)(k, { children: c.error }) : null] }), /* @__PURE__ */ (0, Q.jsxs)(M, { children: [n.enabled ? /* @__PURE__ */ (0, Q.jsx)(E, {
			variant: "secondary",
			type: "button",
			disabled: !!c.busy,
			onClick: () => l("disable"),
			children: "关闭浏览器添加"
		}) : null, /* @__PURE__ */ (0, Q.jsx)(E, {
			type: "button",
			disabled: !n.available || !u || !!c.busy,
			onClick: () => l(n.enabled ? "rotate" : "enable"),
			...K(c.busy === "enable" || c.busy === "rotate"),
			children: n.enabled ? "更新渠道与令牌" : "启用并生成令牌"
		})] })]
	});
}
// src/react/settings/download-settings.tsx
var sr = "/api/configuration/downloads", cr = "/api/configuration/downloads/check", lr = "/api/configuration/downloads/folder", ur = "/api/configuration/downloads/pikpak/login", dr = "/api/configuration/downloads/pikpak/logout", fr = "/api/configuration/downloads/pikpak/browser-login", pr = 2e3, mr = yn("pikpak");
function hr({ initial: e, receipt: t, panel: n, issues: r }) {
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		...er(n),
		children: [r, e ? /* @__PURE__ */ (0, Q.jsx)(gr, {
			initial: e,
			receipt: t
		}) : null]
	});
}
function gr({ initial: e, receipt: t }) {
	let [n, r] = (0, Z.useState)(e), [i, a] = (0, Z.useState)("");
	(0, Z.useEffect)(() => {
		r((t) => ({
			...t,
			media_sources: e.media_sources,
			pikpak_roots: e.pikpak_roots
		}));
	}, [e.media_sources, e.pikpak_roots]);
	let o = n.media_sources ?? [], s = o.includes("pikpak"), c = o.some((e) => Ye.includes(e)), l = s && (n.pikpak.logged_in || !!i.trim());
	return /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [
		c ? /* @__PURE__ */ (0, Q.jsx)(_r, {
			state: n,
			settle: r,
			receipt: t,
			pikpakAccount: l
		}) : null,
		s ? /* @__PURE__ */ (0, Q.jsx)(br, {
			state: n,
			settle: r,
			receipt: t,
			username: i,
			setUsername: a
		}) : null,
		/* @__PURE__ */ (0, Q.jsx)(ar, {
			receipt: t,
			refreshKey: JSON.stringify([
				n.media_sources,
				n.config,
				n.token_set,
				n.pikpak.logged_in
			])
		})
	] });
}
function _r({ state: e, settle: t, receipt: n, pikpakAccount: r }) {
	let [i, a] = (0, Z.useState)(e.config), [o, s] = (0, Z.useState)(""), [c, l] = (0, Z.useState)(String(e.config.wait_hours)), [u, d] = (0, Z.useState)(null), [f, p] = (0, Z.useState)(""), [m, h] = (0, Z.useState)(vr), [g, _] = (0, Z.useState)(""), [v, y] = (0, Z.useState)(!1), b = Y(), x = e.media_sources ?? [], S = x.includes("115"), C = x.includes("pikpak"), w = (e) => i.targets[e] ?? "", T = (e, t) => a({
		...i,
		targets: {
			...i.targets,
			[e]: t
		}
	}), ee = S && !(!m.target || m.target.exists || w("115") !== m.target.path), te = (e, t, n = "") => {
		let r = t.target ? e.suggested_target : null, i = !!(r && n && r.path === n), o = t.root ? e.suggested_pikpak_root : "";
		a((n) => ({
			...n,
			clouddrive_address: t.address && e.address ? e.address : n.clouddrive_address,
			targets: r && !i ? {
				...n.targets,
				115: r.path
			} : n.targets,
			pikpak_root: o || n.pikpak_root
		})), d(e), p(t.address ? e.address : ""), h({
			target: r,
			root: o,
			saved: i
		}), y(!1), _("");
	};
	return (0, Z.useEffect)(() => {
		if (!e.available || !e.config.clouddrive_address || !e.token_set) return;
		let t = {
			address: !1,
			target: !e.config.targets[115],
			root: !e.config.pikpak_root
		};
		b.run("auto", (e) => W(cr, e), (e) => te(e, t), (e) => _(q(e)));
	}, []), /* @__PURE__ */ (0, Q.jsxs)(L, {
		guide: "download",
		title: "云下载",
		onSubmit: (e) => {
			if (e.preventDefault(), ee) {
				y(!0);
				return;
			}
			let u = !w("115").trim(), f = {
				...i,
				wait_hours: c,
				token: o,
				pikpak_account: r
			};
			b.run("save", (e) => G(sr, f, "POST", e), (e) => {
				let { report: r, ...i } = e;
				t(i), a(i.config), l(String(i.config.wait_hours)), s(""), r ? te(r, {
					address: !i.config.clouddrive_address,
					target: u,
					root: !i.config.pikpak_root
				}, i.config.targets[115] ?? "") : (d(null), p(""), h(vr), y(!1), _("")), n("已保存配置");
			}, (e) => _(q(e)));
		},
		children: [
			e.problems?.length ? /* @__PURE__ */ (0, Q.jsx)(V, { children: /* @__PURE__ */ (0, Q.jsx)(F, {
				tone: "error",
				title: "云下载配置需要检查",
				children: e.problems.join("\n")
			}) }) : null,
			/* @__PURE__ */ (0, Q.jsxs)(V, { children: [
				/* @__PURE__ */ (0, Q.jsx)(P, {
					label: "CloudDrive2 地址",
					placeholder: "留空自动查找",
					autoComplete: "off",
					maxLength: 200,
					value: i.clouddrive_address,
					isDisabled: !e.available,
					onChange: (e) => a({
						...i,
						clouddrive_address: e
					})
				}),
				/* @__PURE__ */ (0, Q.jsx)(P, {
					label: "CloudDrive2 API 令牌",
					type: "password",
					autoComplete: "off",
					maxLength: 400,
					placeholder: e.token_set ? "已保存，留空不改" : "在 CloudDrive2「设置 → API 令牌」中生成",
					hint: "需要离线任务权限。",
					value: o,
					isDisabled: !e.available,
					onChange: s
				}),
				S ? /* @__PURE__ */ (0, Q.jsx)(P, {
					label: /* @__PURE__ */ (0, Q.jsx)(Rt, {
						source: "115",
						label: "115 目标目录"
					}),
					placeholder: "留空时根据媒体库目录自动填写",
					autoComplete: "off",
					maxLength: 300,
					validationBehavior: "aria",
					isInvalid: ee,
					hint: ee ? v ? "先新建这个目录，或填写已有目录。" : "这个目录不存在。" : "应位于自动入库的云端路径前缀内。",
					value: w("115"),
					isDisabled: !e.available,
					onChange: (e) => T("115", e)
				}) : null,
				C ? /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)(P, {
					label: /* @__PURE__ */ (0, Q.jsx)(Rt, {
						source: "pikpak",
						label: "PikPak 目标目录"
					}),
					placeholder: "以 / 开头的网盘路径",
					autoComplete: "off",
					maxLength: 300,
					hint: "目录要已经存在。",
					value: w("pikpak"),
					isDisabled: !e.available,
					onChange: (e) => T("pikpak", e)
				}), /* @__PURE__ */ (0, Q.jsxs)("div", {
					className: "flex flex-col gap-1",
					children: [/* @__PURE__ */ (0, Q.jsx)(lt, { children: /* @__PURE__ */ (0, Q.jsx)(Rt, {
						source: "pikpak",
						label: "PikPak 根目录对应的媒体目录"
					}) }), e.pikpak_roots.length ? /* @__PURE__ */ (0, Q.jsx)(R, {
						"aria-label": "PikPak 根目录对应的媒体目录",
						selectedKey: i.pikpak_root || null,
						isDisabled: !e.available,
						placeholder: "检查时根据媒体库目录选择",
						onSelectionChange: (e) => a({
							...i,
							pikpak_root: e === null ? "" : String(e)
						}),
						children: e.pikpak_roots.map((e) => /* @__PURE__ */ (0, Q.jsx)(z, {
							id: e,
							children: e
						}, e))
					}) : /* @__PURE__ */ (0, Q.jsx)(N, { children: "先在「媒体库与入库」添加 PikPak 挂载文件夹。" })]
				})] }) : null,
				/* @__PURE__ */ (0, Q.jsx)(P, {
					label: "等待上限（小时）",
					type: "number",
					inputMode: "numeric",
					autoComplete: "off",
					hint: `超时标为停滞；可填 1–${e.max_wait_hours} 小时。`,
					value: c,
					isDisabled: !e.available,
					onChange: l
				})
			] }),
			b.busy === "auto" ? /* @__PURE__ */ (0, Q.jsx)(V, {
				divided: !0,
				children: /* @__PURE__ */ (0, Q.jsx)(ht, { label: "正在检查 CloudDrive2" })
			}) : null,
			u ? /* @__PURE__ */ (0, Q.jsx)(yr, {
				report: u,
				detected: f,
				suggested: m,
				create: e.available ? (e) => {
					let t = {
						clouddrive_address: i.clouddrive_address,
						token: o,
						path: e,
						pikpak_root: i.pikpak_root,
						pikpak_account: r
					};
					b.run("folder", (e) => G(lr, t, "POST", e), (t) => {
						d(t), h((t) => ({
							...t,
							target: {
								path: e,
								exists: !0
							}
						})), y(!1), _(""), n("已新建目录");
					}, (e) => _(q(e)));
				} : void 0,
				creating: b.busy === "folder"
			}) : null,
			g || b.error ? /* @__PURE__ */ (0, Q.jsx)(V, {
				divided: !0,
				children: /* @__PURE__ */ (0, Q.jsx)(k, { children: g || b.error })
			}) : null,
			/* @__PURE__ */ (0, Q.jsxs)(M, {
				status: e.available ? void 0 : "云下载只在允许修改数据库的设备上可用。",
				children: [/* @__PURE__ */ (0, Q.jsx)(E, {
					variant: "secondary",
					onClick: () => {
						let e = {
							address: !i.clouddrive_address.trim(),
							target: !w("115").trim(),
							root: !i.pikpak_root
						}, t = {
							clouddrive_address: i.clouddrive_address,
							token: o,
							target: w("115"),
							pikpak_root: i.pikpak_root,
							pikpak_account: r
						};
						b.run("check", (e) => G(cr, t, "POST", e), (t) => te(t, e), (e) => _(q(e)));
					},
					disabled: !e.available,
					...K(b.busy === "check"),
					children: "检查连接"
				}), /* @__PURE__ */ (0, Q.jsx)(E, {
					type: "submit",
					disabled: !e.available,
					...K(b.busy === "save"),
					children: "保存配置"
				})]
			})
		]
	});
}
var vr = {
	target: null,
	root: "",
	saved: !1
};
function yr({ report: e, detected: t, suggested: n, create: r, creating: i }) {
	let a = n.target, o = !!(t || a || n.root || e.permissions.length || e.folder || e.quota);
	return !o && !e.problems.length ? null : /* @__PURE__ */ (0, Q.jsxs)(V, {
		divided: !0,
		children: [o ? /* @__PURE__ */ (0, Q.jsxs)(ct, { children: [
			t ? /* @__PURE__ */ (0, Q.jsx)(j, {
				term: "CloudDrive2 地址",
				children: `探测到 ${t}，保存配置后生效`
			}) : null,
			a?.exists ? /* @__PURE__ */ (0, Q.jsx)(j, {
				term: /* @__PURE__ */ (0, Q.jsx)(Rt, {
					source: "115",
					label: "115 目标目录"
				}),
				children: n.saved ? `已根据媒体库目录填入 ${a.path}` : `根据媒体库目录填入 ${a.path}，保存配置后生效`
			}) : null,
			a && !a.exists ? /* @__PURE__ */ (0, Q.jsxs)(j, {
				term: /* @__PURE__ */ (0, Q.jsx)(Rt, {
					source: "115",
					label: "115 目标目录"
				}),
				children: [`${a.path} 不存在`, r ? /* @__PURE__ */ (0, Q.jsx)(E, {
					variant: "secondary",
					size: "small",
					onClick: () => r(a.path),
					...K(i),
					children: "新建这个目录"
				}) : null]
			}) : null,
			n.root ? /* @__PURE__ */ (0, Q.jsx)(j, {
				term: /* @__PURE__ */ (0, Q.jsx)(Rt, {
					source: "pikpak",
					label: "PikPak 根目录"
				}),
				children: `根据媒体库目录填入 ${n.root}，保存配置后生效`
			}) : null,
			e.permissions.length ? /* @__PURE__ */ (0, Q.jsx)(j, {
				term: "离线权限",
				children: e.missing.length ? e.missing.map((e) => /* @__PURE__ */ (0, Q.jsx)(et, {
					variant: "caption",
					color: "yellow",
					children: `缺 ${e}`
				}, e)) : /* @__PURE__ */ (0, Q.jsx)(et, {
					variant: "caption",
					color: "lime",
					children: "齐全"
				})
			}) : null,
			e.folder ? /* @__PURE__ */ (0, Q.jsx)(j, {
				term: "目标目录",
				children: e.folder.can_offline ? `${e.folder.path} 可以离线下载` : `${e.folder.path} 不支持离线下载`
			}) : null,
			e.quota ? /* @__PURE__ */ (0, Q.jsx)(j, {
				term: /* @__PURE__ */ (0, Q.jsx)(Rt, {
					source: "115",
					label: "115 离线配额"
				}),
				children: `本月还剩 ${e.quota.left} 条，共 ${e.quota.total} 条`
			}) : null
		] }) : null, e.problems.map((e) => /* @__PURE__ */ (0, Q.jsx)(k, { children: e }, e))]
	});
}
function br({ state: e, settle: t, receipt: n, username: r, setUsername: i }) {
	let [a, o] = (0, Z.useState)(""), [s, c] = (0, Z.useState)(!1), [l, u] = (0, Z.useState)(""), [d, f] = (0, Z.useState)(""), [p, m] = (0, Z.useState)(""), h = Y(), g = e.pikpak, _ = e.pikpak_browser, v = _.state === "waiting";
	(0, Z.useEffect)(() => {
		if (!v) return;
		let e = new AbortController(), r, i = async () => {
			try {
				let r = await W(fr, e.signal);
				if (e.signal.aborted || (t(r), r.pikpak_browser.state === "done" ? n("已登录 PikPak") : r.pikpak_browser.state !== "waiting" && m(r.pikpak_browser.message), r.pikpak_browser.state !== "waiting")) return;
			} catch (t) {
				if (e.signal.aborted) return;
				f(q(t));
			}
			r = setTimeout(i, pr);
		};
		return r = setTimeout(i, pr), () => {
			e.abort(), clearTimeout(r);
		};
	}, [v]);
	let y = () => {
		m(""), h.run("browser", (e) => G(fr, {}, "POST", e), (e) => {
			t(e), f("");
		}, (e) => f(q(e)));
	}, b = () => {
		h.run("cancel", (e) => G(`${fr}/cancel`, {}, "POST", e), (e) => {
			t(e), f(""), m(e.pikpak_browser.message);
		}, (e) => f(q(e)));
	}, x = (e) => {
		if (e.preventDefault(), g.logged_in) return;
		let i = {
			username: r,
			password: a,
			remember: s
		};
		h.run("login", (e) => G(ur, i, "POST", e), (e) => {
			t(e.settings), f(""), e.ok ? (u(""), o(""), n("已登录 PikPak")) : u(e.captcha_url ?? "");
		}, (e) => f(q(e)));
	}, S = () => {
		h.run("logout", (e) => G(dr, {}, "POST", e), (e) => {
			t(e), f(""), n("已登出 PikPak");
		}, (e) => f(q(e)));
	}, C = /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [
		/* @__PURE__ */ (0, Q.jsx)(P, {
			label: "账号",
			placeholder: "邮箱或手机号",
			autoComplete: "username",
			maxLength: 200,
			value: r,
			isDisabled: !e.available,
			onChange: i
		}),
		/* @__PURE__ */ (0, Q.jsx)(P, {
			label: "密码",
			type: "password",
			autoComplete: "current-password",
			maxLength: 200,
			value: a,
			isDisabled: !e.available,
			onChange: o
		}),
		/* @__PURE__ */ (0, Q.jsx)(D, {
			isSelected: s,
			isDisabled: !e.available,
			onChange: c,
			children: "保存密码，登录过期时自动重新登录"
		}),
		l ? /* @__PURE__ */ (0, Q.jsx)(F, {
			tone: "warning",
			title: "需要人机验证",
			extra: /* @__PURE__ */ (0, Q.jsx)("div", {
				className: "pt-2",
				children: /* @__PURE__ */ (0, Q.jsx)(A, {
					href: l,
					children: "打开 PikPak 验证页"
				})
			}),
			children: "在浏览器里完成验证后，回到这里再点一次「登录」。"
		}) : null
	] }), w = /* @__PURE__ */ (0, Q.jsx)(E, {
		type: "submit",
		variant: "primary",
		disabled: !e.available || v,
		...K(h.busy === "login"),
		children: "登录"
	}), T = _.state === "timeout" || _.state === "failed";
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		guide: "pikpak",
		title: "PikPak 账号",
		icon: /* @__PURE__ */ (0, Q.jsx)(mr, {}),
		onSubmit: x,
		aside: /* @__PURE__ */ (0, Q.jsx)(H, {
			tone: g.logged_in ? "success" : v ? "progress" : T ? "error" : "neutral",
			children: g.logged_in ? "已登录" : v ? "等待登录" : T ? "登录未完成" : "待登录"
		}),
		children: [
			g.logged_in ? /* @__PURE__ */ (0, Q.jsxs)(ct, { children: [/* @__PURE__ */ (0, Q.jsx)(j, {
				term: "账号",
				children: g.username || "已登录"
			}), g.method === "browser" ? /* @__PURE__ */ (0, Q.jsx)(j, {
				term: "登录方式",
				children: "浏览器登录，由 Peach 续期"
			}) : /* @__PURE__ */ (0, Q.jsx)(j, {
				term: "密码",
				children: g.remember ? "已保存，登录过期时自动重新登录" : "未保存，登录过期后需要回到这里重新登录"
			})] }) : /* @__PURE__ */ (0, Q.jsxs)(V, { children: [p ? T ? /* @__PURE__ */ (0, Q.jsx)(k, { children: p }) : /* @__PURE__ */ (0, Q.jsx)(N, {
				role: "status",
				children: p
			}) : null, C] }),
			d || h.error ? /* @__PURE__ */ (0, Q.jsx)(V, {
				divided: !0,
				children: /* @__PURE__ */ (0, Q.jsx)(k, { children: d || h.error })
			}) : null,
			/* @__PURE__ */ (0, Q.jsx)(M, {
				status: !g.logged_in && v ? /* @__PURE__ */ (0, Q.jsx)(ht, { label: _.message || "等你在浏览器窗口里登录 PikPak" }) : null,
				children: g.logged_in ? /* @__PURE__ */ (0, Q.jsx)(E, {
					variant: "secondary",
					onClick: S,
					disabled: !e.available,
					...K(h.busy === "logout"),
					children: "登出"
				}) : /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [_.available ? v ? /* @__PURE__ */ (0, Q.jsx)(E, {
					variant: "secondary",
					type: "button",
					onClick: b,
					...K(h.busy === "cancel"),
					children: "取消"
				}) : /* @__PURE__ */ (0, Q.jsx)(E, {
					variant: "secondary",
					type: "button",
					onClick: y,
					disabled: !e.available,
					...K(h.busy === "browser"),
					children: "用浏览器登录"
				}) : null, w] })
			})
		]
	});
}
// src/react/settings/library-sharing-settings.tsx
function xr({ initial: e, receipt: t }) {
	let [n, r] = (0, Z.useState)(e), [i, a] = (0, Z.useState)(null), [o, s] = (0, Z.useState)(!1), [c, l] = (0, Z.useState)(!1), u = (0, Z.useMemo)(() => i ? JSON.stringify(i.data, null, 2) : "", [i]), d = Y(), f = (e) => void d.run("save", (t) => G("/api/configuration/library-sharing", {
		enabled: e,
		schema: n.schema,
		consent: c,
		preview_token: i?.token
	}, "POST", t), (e) => {
		r(e), a(null), l(!1), s(!1), t("已保存馆藏与口味上传选项");
	}), p = () => {
		let e = URL.createObjectURL(new Blob([u], { type: "application/json" })), t = document.createElement("a");
		t.href = e, t.download = "peach-library-taste-preview.json", document.body.append(t);
		try {
			t.click();
		} finally {
			t.remove(), setTimeout(() => URL.revokeObjectURL(e), 1e3);
		}
	};
	return /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [
		/* @__PURE__ */ (0, Q.jsx)(I, { children: /* @__PURE__ */ (0, Q.jsx)(B, {
			label: "上传馆藏与口味明细",
			description: n.notice,
			children: /* @__PURE__ */ (0, Q.jsx)(U, {
				"aria-label": "上传馆藏与口味明细",
				isSelected: n.enabled,
				onChange: (e) => e ? s(!0) : f(!1),
				...K(d.busy === "save")
			})
		}) }),
		n.available ? null : /* @__PURE__ */ (0, Q.jsx)(V, {
			divided: !0,
			children: /* @__PURE__ */ (0, Q.jsx)("span", {
				className: "self-start",
				children: /* @__PURE__ */ (0, Q.jsx)(H, { children: "上传服务未配置" })
			})
		}),
		n.enabled && n.last_attempt?.status === "failed" ? /* @__PURE__ */ (0, Q.jsxs)(V, {
			divided: !0,
			children: [/* @__PURE__ */ (0, Q.jsx)("span", {
				className: "self-start",
				children: /* @__PURE__ */ (0, Q.jsx)(H, {
					tone: n.last_attempt.attempted ? "error" : "warning",
					children: n.last_attempt.attempted ? "上传失败" : "待重新准备"
				})
			}), /* @__PURE__ */ (0, Q.jsx)(k, { children: n.last_attempt.attempted ? "馆藏与口味上传失败，本周不再发送。" : "馆藏与口味上传未完成，将自动重新准备。" })]
		}) : null,
		n.enabled && n.last_attempt?.status === "waiting-data" ? /* @__PURE__ */ (0, Q.jsxs)(V, {
			divided: !0,
			children: [/* @__PURE__ */ (0, Q.jsx)("span", {
				className: "self-start",
				children: /* @__PURE__ */ (0, Q.jsx)(H, { children: "等待数据" })
			}), /* @__PURE__ */ (0, Q.jsx)(N, { children: "等待可分析的馆藏或偏好数据。" })]
		}) : null,
		n.enabled && n.last_attempt?.status === "unknown" ? /* @__PURE__ */ (0, Q.jsxs)(V, {
			divided: !0,
			children: [/* @__PURE__ */ (0, Q.jsx)("span", {
				className: "self-start",
				children: /* @__PURE__ */ (0, Q.jsx)(H, {
					tone: "warning",
					children: "结果未取得"
				})
			}), /* @__PURE__ */ (0, Q.jsx)(N, { children: "未取得上传结果，本周不再发送。" })]
		}) : null,
		i ? /* @__PURE__ */ (0, Q.jsxs)(V, {
			divided: !0,
			children: [
				/* @__PURE__ */ (0, Q.jsxs)(N, { children: [
					"当前预览包含 ",
					i.data.library.length,
					" 部有编号作品、",
					i.data.coverage.uncoded_items,
					" 条无编号馆藏的汇总，约 ",
					(i.bytes / 1024).toFixed(1),
					" KiB。不含账号、设备、文件路径和浏览器历史记录等个人数据。"
				] }),
				/* @__PURE__ */ (0, Q.jsx)(O, {
					summary: "上传数据预览",
					defaultOpen: !0,
					children: /* @__PURE__ */ (0, Q.jsx)(Bn, {
						code: u,
						language: "json",
						label: "馆藏与口味上传预览",
						maxCharacters: 24e3
					})
				}),
				u.length > 24e3 ? /* @__PURE__ */ (0, Q.jsx)(N, { children: "显示前 24,000 个字符，下载可查看完整内容。" }) : null,
				/* @__PURE__ */ (0, Q.jsx)(E, {
					variant: "secondary",
					onClick: p,
					children: "下载完整预览"
				}),
				n.enabled ? null : /* @__PURE__ */ (0, Q.jsx)(D, {
					isSelected: c,
					onChange: l,
					children: "我已查看上传预览，同意上传馆藏与口味明细"
				})
			]
		}) : null,
		d.error ? /* @__PURE__ */ (0, Q.jsx)(V, {
			divided: !0,
			children: /* @__PURE__ */ (0, Q.jsx)(k, { children: d.error })
		}) : null,
		/* @__PURE__ */ (0, Q.jsxs)(M, { children: [
			o && !n.enabled ? /* @__PURE__ */ (0, Q.jsx)(E, {
				variant: "secondary",
				onClick: () => {
					s(!1), a(null), l(!1);
				},
				children: "取消"
			}) : null,
			/* @__PURE__ */ (0, Q.jsx)(E, {
				variant: "secondary",
				onClick: () => {
					s(!0), d.run("preview", (e) => W("/api/configuration/library-sharing/preview", e), (e) => {
						a(e), l(!1);
					});
				},
				...K(d.busy === "preview"),
				children: "预览上传内容"
			}),
			!n.enabled && i ? /* @__PURE__ */ (0, Q.jsx)(E, {
				variant: "primary",
				disabled: !c,
				onClick: () => f(!0),
				...K(d.busy === "save"),
				children: "同意并开启上传"
			}) : null
		] })
	] });
}
// src/react/settings/remote-reporting-settings.tsx
function Sr({ value: e, onChange: t, busy: n = !1 }) {
	return /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)(I, { children: /* @__PURE__ */ (0, Q.jsx)(B, {
		label: "发送版本统计与错误诊断（推荐）",
		description: "上传版本、系统信息、故障类型、代码位置与发生次数。",
		children: /* @__PURE__ */ (0, Q.jsx)(U, {
			"aria-label": "发送版本统计与错误诊断（推荐）",
			isSelected: e.usage && e.errors,
			onChange: (n) => t({
				...e,
				usage: n,
				errors: n
			}),
			...K(n)
		})
	}) }), e.available ? null : /* @__PURE__ */ (0, Q.jsx)(V, {
		divided: !0,
		children: /* @__PURE__ */ (0, Q.jsx)("span", {
			className: "self-start",
			children: /* @__PURE__ */ (0, Q.jsx)(H, { children: "上传服务未配置" })
		})
	})] });
}
function Cr({ initial: e, receipt: t }) {
	let [n, r] = (0, Z.useState)(e), i = Y();
	return /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)(Sr, {
		value: n,
		busy: i.busy === "save",
		onChange: (e) => {
			i.run("save", (t) => G("/api/configuration/remote-reporting", {
				usage: e.usage,
				errors: e.errors
			}, "POST", t), (e) => {
				r(e), t("已保存诊断选项");
			});
		}
	}), i.error ? /* @__PURE__ */ (0, Q.jsx)(V, {
		divided: !0,
		children: /* @__PURE__ */ (0, Q.jsx)(k, { children: i.error })
	}) : null] });
}
// src/react/components/animated-number.tsx
var wr = .6;
function Tr({ value: e, format: t = (e) => Math.round(e).toLocaleString(), className: n }) {
	let r = Fn(), [i, a] = (0, Z.useState)(e), o = (0, Z.useRef)(e);
	return (0, Z.useEffect)(() => {
		if (r || o.current === e) {
			o.current = e, a(e);
			return;
		}
		let t = Gt(o.current, e, {
			duration: wr,
			ease: "easeOut",
			onUpdate: (e) => {
				o.current = e, a(e);
			}
		});
		return () => t.stop();
	}, [e, r]), /* @__PURE__ */ (0, Q.jsx)("span", {
		className: n ? `tabular-nums ${n}` : "tabular-nums",
		children: t(i)
	});
}
// node_modules/recharts/es6/state/selectors/pieSelectors.js
function Er(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function Dr(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Er(Object(n), !0).forEach(function(t) {
			Or(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Er(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Or(e, t, n) {
	return (t = kr(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function kr(e) {
	var t = Ar(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function Ar(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var jr = oe([De, (e, t) => t], (e, t) => e.filter((e) => e.type === "pie").find((e) => e.id === t)), Mr = [], Nr = (e, t, n) => n?.length === 0 ? Mr : n, Pr = oe([
	Te,
	jr,
	Nr
], (e, t, n) => {
	var r = e.chartData;
	if (t != null) {
		var i = t?.data != null && t.data.length > 0 ? t.data : r;
		if (i && i.length || n == null || (i = n.map((e) => Dr(Dr({}, t.presentationProps), e.props))), i != null) return i;
	}
}), Fr = oe([
	Pr,
	jr,
	Nr
], (e, t, n) => {
	if (e != null && t != null) return e.map((e, r) => {
		var i, a = he(e, t.nameKey, t.name), o = n != null && (i = n[r]) != null && (i = i.props) != null && i.fill ? n[r].props.fill : typeof e == "object" && e && "fill" in e ? e.fill : t.fill;
		return {
			value: me(a, t.dataKey),
			dataKey: t.dataKey,
			color: o,
			payload: e,
			type: t.legendType
		};
	});
}), Ir = oe([
	Pr,
	jr,
	Nr,
	Ee
], (e, t, n, r) => {
	if (t != null && e != null) return si({
		offset: r,
		pieSettings: t,
		displayedData: e,
		cells: n
	});
}), Lr = ["key"], Rr = [
	"onMouseEnter",
	"onClick",
	"onMouseLeave"
], zr = ["id"], Br = ["id"];
function Vr() {
	return Vr = Object.assign ? Object.assign.bind() : function(e) {
		for (var t = 1; t < arguments.length; t++) {
			var n = arguments[t];
			for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
		}
		return e;
	}, Vr.apply(null, arguments);
}
function Hr(e, t) {
	if (e == null) return {};
	var n, r, i = Ur(e, t);
	if (Object.getOwnPropertySymbols) {
		var a = Object.getOwnPropertySymbols(e);
		for (r = 0; r < a.length; r++) n = a[r], t.indexOf(n) === -1 && {}.propertyIsEnumerable.call(e, n) && (i[n] = e[n]);
	}
	return i;
}
function Ur(e, t) {
	if (e == null) return {};
	var n = {};
	for (var r in e) if ({}.hasOwnProperty.call(e, r)) {
		if (t.indexOf(r) !== -1) continue;
		n[r] = e[r];
	}
	return n;
}
function Wr(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function $(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? Wr(Object(n), !0).forEach(function(t) {
			Gr(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Wr(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function Gr(e, t, n) {
	return (t = Kr(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function Kr(e) {
	var t = qr(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function qr(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var Jr = S;
function Yr(e) {
	var n = (0, Z.useMemo)(() => ce(e.children, t), [e.children]), r = Me((t) => Fr(t, e.id, n));
	return r == null ? null : /*#__PURE__*/ Z.createElement(w, { legendPayload: r });
}
function Xr(e) {
	if (e != null && typeof e != "boolean" && typeof e != "function") {
		if (/*#__PURE__*/ Z.isValidElement(e)) {
			var t = e.props?.fill;
			return typeof t == "string" ? t : void 0;
		}
		var n = e.fill;
		return typeof n == "string" ? n : void 0;
	}
}
var Zr = /*#__PURE__*/ Z.memo((e) => {
	var t = e.dataKey, n = e.nameKey, r = e.sectors, i = e.stroke, a = e.strokeWidth, o = e.fill, s = e.name, c = e.hide, l = e.tooltipType, u = e.formatter, d = e.id, f = e.activeShape, p = Xr(f), m = {
		dataDefinedOnItem: r.map((e) => {
			var t = e.tooltipPayload;
			return p == null || t == null ? t : t.map((e) => $($({}, e), {}, {
				color: p,
				fill: p
			}));
		}),
		getPosition: (e) => r[Number(e)]?.tooltipPosition,
		settings: {
			stroke: i,
			strokeWidth: a,
			fill: o,
			dataKey: t,
			nameKey: n,
			name: me(s, t),
			hide: c,
			type: l,
			color: o,
			unit: "",
			formatter: u,
			graphicalItemId: d
		}
	};
	return /*#__PURE__*/ Z.createElement(T, { tooltipEntrySettings: m });
}), Qr = (e, t) => e > t ? "start" : e < t ? "end" : "middle", $r = (e, t, n) => pe(typeof t == "function" ? t(e) : t, n, n * .8), ei = (e, t, n) => {
	var r = t.top, i = t.left, a = t.width, o = t.height, s = fe(a, o);
	return {
		cx: i + pe(e.cx, a, a / 2),
		cy: r + pe(e.cy, o, o / 2),
		innerRadius: pe(e.innerRadius, s, 0),
		outerRadius: $r(n, e.outerRadius, s),
		maxRadius: e.maxRadius || Math.sqrt(a * a + o * o) / 2
	};
}, ti = (e, t) => ye(t - e) * Math.min(Math.abs(t - e), 360), ni = (e, t) => {
	if (/*#__PURE__*/ Z.isValidElement(e)) return /*#__PURE__*/ Z.cloneElement(e, t);
	if (typeof e == "function") return e(t);
	var n = Xt("recharts-pie-label-line", typeof e == "boolean" ? "" : e.className);
	t.key;
	var r = Hr(t, Lr);
	return /*#__PURE__*/ Z.createElement(l, Vr({}, r, {
		type: "linear",
		className: n
	}));
}, ri = (e, t, n) => {
	if (/*#__PURE__*/ Z.isValidElement(e)) return /*#__PURE__*/ Z.cloneElement(e, t);
	var r = n;
	if (typeof e == "function" && (r = e(t), /*#__PURE__*/ Z.isValidElement(r))) return r;
	var i = Xt("recharts-pie-label-text", ue(e));
	return /*#__PURE__*/ Z.createElement(ne, Vr({}, t, {
		alignmentBaseline: "middle",
		className: i
	}), r);
};
function ii(e) {
	var t = e.sectors, n = e.props, r = e.showLabels, i = n.label, a = n.labelLine, o = n.dataKey;
	if (!r || !i || !t) return null;
	var s = Oe(n), c = ke(i), l = ke(a), u = typeof i == "object" && "offsetRadius" in i && typeof i.offsetRadius == "number" && i.offsetRadius || 20, d = t.map((e, t) => {
		var n = (e.startAngle + e.endAngle) / 2, r = be(e.cx, e.cy, e.outerRadius + u, n), d = $($($($({}, s), e), {}, { stroke: "none" }, c), {}, {
			index: t,
			textAnchor: Qr(r.x, e.cx)
		}, r), p = $($($($({}, s), e), {}, {
			fill: "none",
			stroke: e.fill
		}, l), {}, {
			index: t,
			points: [be(e.cx, e.cy, e.outerRadius, n), r],
			key: "line"
		});
		return /*#__PURE__*/ Z.createElement(re, {
			zIndex: f.label,
			key: `label-${e.startAngle}-${e.endAngle}-${e.midAngle}-${t}`
		}, /*#__PURE__*/ Z.createElement(g, null, a && ni(a, p), ri(i, d, he(e, o))));
	});
	return /*#__PURE__*/ Z.createElement(g, { className: "recharts-pie-labels" }, d);
}
function ai(e) {
	var t = e.sectors, n = e.props, r = e.showLabels, i = n.label;
	return typeof i == "object" && i && "position" in i ? /*#__PURE__*/ Z.createElement(h, { label: i }) : /*#__PURE__*/ Z.createElement(ii, {
		sectors: t,
		props: n,
		showLabels: r
	});
}
function oi(e) {
	var t = e.sectors, n = e.activeShape, r = e.inactiveShape, i = e.allOtherPieProps, a = e.shape, o = e.id, s = e.animationElapsedTime, c = e.isAnimating, l = e.isEntrance, f = Me(we), p = Me(Se), m = Me(Ce), h = i.onMouseEnter, _ = i.onClick, v = i.onMouseLeave, y = Hr(i, Rr), b = Pe(h, i.dataKey, o), x = Fe(v), S = Ne(_, i.dataKey, o);
	return t == null || t.length === 0 ? null : /*#__PURE__*/ Z.createElement(Z.Fragment, null, t.map((e, h) => {
		if (e?.startAngle === 0 && e?.endAngle === 0 && t.length !== 1) return null;
		var _ = m == null || m === o, v = String(h) === f && (p == null || i.dataKey === p) && _, C = n && v ? n : f ? r : null, w = $($({}, e), {}, {
			stroke: e.stroke,
			tabIndex: -1,
			index: h,
			isActive: v,
			animationElapsedTime: s,
			isAnimating: c,
			isEntrance: l,
			[d]: h,
			[u]: o
		});
		return /*#__PURE__*/ Z.createElement(g, Vr({
			key: `sector-${e?.startAngle}-${e?.endAngle}-${e.midAngle}-${h}`,
			tabIndex: -1,
			className: "recharts-pie-sector"
		}, ie(y, e, h), {
			onMouseEnter: b(e, h),
			onMouseLeave: x(e, h),
			onClick: S(e, h)
		}), /*#__PURE__*/ Z.createElement(ee, {
			option: C ?? a,
			DefaultShape: Jr,
			shapeProps: w
		}));
	}));
}
function si(e) {
	var t = e.pieSettings, n = e.displayedData, r = e.cells, i = e.offset, a = t.cornerRadius, o = t.startAngle, s = t.endAngle, c = t.dataKey, l = t.nameKey, u = t.tooltipType, d = Math.abs(t.minAngle), f = ti(o, s), p = Math.abs(f), m = n.length <= 1 ? 0 : t.paddingAngle ?? 0, h = n.filter((e) => he(e, c, 0) !== 0).length, g = (p >= 360 ? h : h - 1) * m, _ = n.reduce((e, t) => {
		var n = he(t, c, 0);
		return e + (_e(n) ? n : 0);
	}, 0), v = d > 0 && _ > 0 && n.some((e) => {
		var t = he(e, c, 0), n = (_e(t) ? t : 0) / _;
		return t !== 0 && n * p < d;
	}) ? d : 0, y = p - h * v - g, b;
	if (_ > 0) {
		var x;
		b = n.map((e, n) => {
			var s = he(e, c, 0), d = he(e, l, n), p = ei(t, i, e), h = (_e(s) ? s : 0) / _, g, b = $($({}, e), r && r[n] && r[n].props), S = b != null && "fill" in b && typeof b.fill == "string" ? b.fill : t.fill;
			g = n ? x.endAngle + ye(f) * m * (s === 0 ? 0 : 1) : o;
			var C = g + ye(f) * ((s === 0 ? 0 : v) + h * y), w = (g + C) / 2, T = (p.innerRadius + p.outerRadius) / 2, ee = [{
				name: d,
				value: s,
				payload: b,
				dataKey: c,
				type: u,
				color: S,
				fill: S,
				graphicalItemId: t.id
			}], te = be(p.cx, p.cy, T, w);
			return x = $($($($({}, t.presentationProps), {}, {
				percent: h,
				cornerRadius: typeof a == "string" ? parseFloat(a) : a,
				name: d,
				tooltipPayload: ee,
				midAngle: w,
				middleRadius: T,
				tooltipPosition: te
			}, b), p), {}, {
				value: s,
				dataKey: c,
				startAngle: g,
				endAngle: C,
				payload: b,
				paddingAngle: s === 0 ? 0 : ye(f) * m
			}), x;
		});
	}
	return b;
}
function ci(e) {
	var t = e.showLabels, n = e.sectors, r = e.children, i = (0, Z.useMemo)(() => !t || !n ? [] : n.map((e) => ({
		value: e.value,
		payload: e.payload,
		clockWise: !1,
		parentViewBox: void 0,
		viewBox: {
			cx: e.cx,
			cy: e.cy,
			innerRadius: e.innerRadius,
			outerRadius: e.outerRadius,
			startAngle: e.startAngle,
			endAngle: e.endAngle,
			clockWise: !1
		},
		fill: e.fill
	})), [n, t]);
	return /*#__PURE__*/ Z.createElement(b, { value: t ? i : void 0 }, r);
}
var li = (e, t) => {
	if (e == null) return [];
	var n = [], r = e.find((e) => e.status !== "removed"), i = r ? r.next.startAngle : 0;
	return e.forEach((e, r) => {
		if (e.status !== "removed") {
			var a = r > 0 ? le(e.next, "paddingAngle", 0) : 0;
			if (e.status === "matched") {
				var o = ge(e.prev.endAngle - e.prev.startAngle, e.next.endAngle - e.next.startAngle, t), s = $($({}, e.next), {}, {
					startAngle: i + a,
					endAngle: i + o + a
				});
				n.push(s), i = s.endAngle;
			} else {
				var c = ge(0, e.next.endAngle - e.next.startAngle, t), l = $($({}, e.next), {}, {
					startAngle: i + a,
					endAngle: i + c + a
				});
				n.push(l), i = l.endAngle;
			}
		}
	}), n;
};
function ui(t) {
	var n = t.props, r = t.previousSectorsRef, i = t.id, a = n.sectors, o = n.activeShape, s = n.inactiveShape, c = n.animationInterpolateFn, l = je(n.onAnimationStart, n.onAnimationEnd), u = l.isAnimating, d = l.handleAnimationStart, f = l.handleAnimationEnd, p = Ie();
	if (p == null) return null;
	var m = a[0];
	return /*#__PURE__*/ Z.createElement(ci, {
		showLabels: !u,
		sectors: a
	}, /*#__PURE__*/ Z.createElement(e, {
		animationInput: n,
		animationIdPrefix: "recharts-pie-",
		items: a,
		previousItemsRef: r,
		isAnimationActive: n.isAnimationActive,
		animationBegin: n.animationBegin,
		animationDuration: n.animationDuration,
		animationEasing: n.animationEasing,
		onAnimationStart: d,
		onAnimationEnd: f,
		animationInterpolateFn: c,
		animationMatchBy: n.animationMatchBy,
		layout: p
	}, (e, t, r) => /*#__PURE__*/ Z.createElement(g, null, /*#__PURE__*/ Z.createElement(oi, {
		sectors: e,
		activeShape: o,
		inactiveShape: s,
		allOtherPieProps: n,
		shape: n.shape,
		id: i,
		animationElapsedTime: t,
		isAnimating: u || t < 1,
		isEntrance: r
	}))), /*#__PURE__*/ Z.createElement(ai, {
		showLabels: !u,
		sectors: a,
		props: n
	}), /*#__PURE__*/ Z.createElement(y, {
		cx: m?.cx ?? 0,
		cy: m?.cy ?? 0,
		innerRadius: m?.innerRadius ?? 0,
		outerRadius: m?.outerRadius ?? 0,
		startAngle: n.startAngle,
		endAngle: n.endAngle,
		clockWise: !1
	}, n.children));
}
var di = {
	animationBegin: 400,
	animationDuration: 1500,
	animationEasing: "ease",
	animationInterpolateFn: li,
	animationMatchBy: ve,
	cx: "50%",
	cy: "50%",
	dataKey: "value",
	endAngle: 360,
	fill: "#808080",
	hide: !1,
	innerRadius: 0,
	isAnimationActive: "auto",
	label: !1,
	labelLine: !0,
	legendType: "rect",
	minAngle: 0,
	nameKey: "name",
	outerRadius: "80%",
	paddingAngle: 0,
	rootTabIndex: 0,
	shape: Jr,
	startAngle: 0,
	stroke: "#fff",
	zIndex: f.area
};
function fi(e) {
	var n = e.id, r = Hr(e, zr), i = e.hide, a = e.className, o = e.rootTabIndex, s = (0, Z.useMemo)(() => ce(e.children, t), [e.children]), c = Me((e) => Ir(e, n, s)), l = (0, Z.useRef)(null), u = Xt("recharts-pie", a);
	return i || c == null ? (l.current = null, /*#__PURE__*/ Z.createElement(g, {
		tabIndex: o,
		className: u
	})) : /*#__PURE__*/ Z.createElement(re, { zIndex: e.zIndex }, /*#__PURE__*/ Z.createElement(Zr, {
		dataKey: e.dataKey,
		nameKey: e.nameKey,
		sectors: c,
		stroke: e.stroke,
		strokeWidth: e.strokeWidth,
		fill: e.fill,
		name: e.name,
		hide: e.hide,
		tooltipType: e.tooltipType,
		formatter: e.formatter,
		id: n,
		activeShape: e.activeShape
	}), /*#__PURE__*/ Z.createElement(g, {
		tabIndex: o,
		className: u
	}, /*#__PURE__*/ Z.createElement(ui, {
		props: $($({}, r), {}, { sectors: c }),
		previousSectorsRef: l,
		id: n
	})));
}
function pi(e) {
	var t = xe(e, di), n = t.id, r = Hr(t, Br), i = Oe(r);
	return /*#__PURE__*/ Z.createElement(x, {
		id: n,
		type: "pie"
	}, (e) => /*#__PURE__*/ Z.createElement(Z.Fragment, null, /*#__PURE__*/ Z.createElement(C, {
		type: "pie",
		id: e,
		data: r.data,
		dataKey: r.dataKey,
		hide: r.hide,
		angleAxisId: 0,
		radiusAxisId: 0,
		name: r.name,
		nameKey: r.nameKey,
		tooltipType: r.tooltipType,
		legendType: r.legendType,
		fill: r.fill,
		cx: r.cx,
		cy: r.cy,
		startAngle: r.startAngle,
		endAngle: r.endAngle,
		paddingAngle: r.paddingAngle,
		minAngle: r.minAngle,
		innerRadius: r.innerRadius,
		outerRadius: r.outerRadius,
		cornerRadius: r.cornerRadius,
		presentationProps: i,
		maxRadius: t.maxRadius
	}), /*#__PURE__*/ Z.createElement(Yr, Vr({}, r, { id: e })), /*#__PURE__*/ Z.createElement(fi, Vr({}, r, { id: e }))));
}
var mi = pi;
mi.displayName = "Pie";
// node_modules/recharts/es6/chart/PieChart.js
function hi(e, t) {
	var n = Object.keys(e);
	if (Object.getOwnPropertySymbols) {
		var r = Object.getOwnPropertySymbols(e);
		t && (r = r.filter(function(t) {
			return Object.getOwnPropertyDescriptor(e, t).enumerable;
		})), n.push.apply(n, r);
	}
	return n;
}
function gi(e) {
	for (var t = 1; t < arguments.length; t++) {
		var n = arguments[t] == null ? {} : arguments[t];
		t % 2 ? hi(Object(n), !0).forEach(function(t) {
			_i(e, t, n[t]);
		}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : hi(Object(n)).forEach(function(t) {
			Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
		});
	}
	return e;
}
function _i(e, t, n) {
	return (t = vi(t)) in e ? Object.defineProperty(e, t, {
		value: n,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : e[t] = n, e;
}
function vi(e) {
	var t = yi(e, "string");
	return typeof t == "symbol" ? t : t + "";
}
function yi(e, t) {
	if (typeof e != "object" || !e) return e;
	var n = e[Symbol.toPrimitive];
	if (n !== void 0) {
		var r = n.call(e, t || "default");
		if (typeof r != "object") return r;
		throw TypeError("@@toPrimitive must return a primitive value.");
	}
	return (t === "string" ? String : Number)(e);
}
var bi = ["item"], xi = gi(gi({}, se), {}, {
	layout: "centric",
	startAngle: 0,
	endAngle: 360
}), Si = /*#__PURE__*/ (0, Z.forwardRef)((e, t) => {
	var n = xe(e, xi);
	return /*#__PURE__*/ Z.createElement(v, {
		chartName: "PieChart",
		defaultTooltipEventType: "item",
		validateTooltipEventTypes: bi,
		tooltipPayloadSearcher: ae,
		categoricalChartProps: n,
		ref: t
	});
}), Ci = 5, wi = 2e3, Ti = 0, Ei = "80%", Di = 0, Oi = 0, ki = 0, Ai = 360, ji = [], Mi = (0, Z.createContext)(null);
function Ni() {
	let e = (0, Z.use)(Mi);
	if (!e) throw Error("Pie chart parts (<Pie />, <Tooltip />, …) must be used within <EvilPieChart />");
	return e;
}
function Pi({ config: e, data: t, dataKey: n, nameKey: i, children: a, className: o, chartProps: s, defaultSelectedSector: c = null, onSelectionChange: l, isLoading: u = !1 }) {
	let [d, f] = (0, Z.useState)(c), p = (0, Z.useCallback)((e) => {
		if (f(e), e === null) {
			l?.(null);
			return;
		}
		let r = t.find((t) => t[i] === e);
		r && l?.({
			dataKey: e,
			value: r[n]
		});
	}, [
		t,
		n,
		i,
		l
	]), m = (0, Z.useMemo)(() => ({
		config: e,
		data: t,
		dataKey: n,
		nameKey: i,
		isLoading: u,
		selectedSector: d,
		selectSector: p
	}), [
		e,
		t,
		n,
		i,
		u,
		d,
		p
	]);
	return /* @__PURE__ */ (0, Q.jsx)(Mi, {
		value: m,
		children: /* @__PURE__ */ (0, Q.jsxs)(r, {
			className: o,
			config: e,
			children: [/* @__PURE__ */ (0, Q.jsx)(_, { isLoading: u }), /* @__PURE__ */ (0, Q.jsx)(Si, {
				id: "evil-charts-pie-chart",
				accessibilityLayer: !0,
				...s,
				children: a
			})]
		})
	});
}
function Fi({ variant: e = "gradient", innerRadius: t = Ti, outerRadius: n = Ei, cornerRadius: r = Di, paddingAngle: i = Oi, startAngle: a = ki, endAngle: o = Ai, isClickable: s = !1, glowingSectors: c = ji, children: l, pieProps: u }) {
	let { config: d, data: f, dataKey: p, nameKey: m, isLoading: h, selectedSector: g, selectSector: _ } = Ni(), v = (0, Z.useId)().replace(/:/g, "");
	if (h) return /* @__PURE__ */ (0, Q.jsx)(mi, {
		data: Ui,
		dataKey: "value",
		nameKey: "name",
		innerRadius: t,
		outerRadius: n,
		cornerRadius: r,
		paddingAngle: i,
		startAngle: a,
		endAngle: o,
		strokeWidth: 0,
		isAnimationActive: !1,
		shape: (e) => /* @__PURE__ */ (0, Q.jsx)(Wi, { ...e })
	});
	let y = Bi(l, p), b = f.map((e) => ({
		...e,
		fill: `url(#${v}-colors-${e[m]})`
	}));
	return /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)(mi, {
		data: b,
		dataKey: p,
		nameKey: m,
		innerRadius: t,
		outerRadius: n,
		cornerRadius: r,
		paddingAngle: i,
		startAngle: a,
		endAngle: o,
		strokeWidth: 0,
		isAnimationActive: !0,
		style: s ? { cursor: "pointer" } : void 0,
		onClick: (e, t) => {
			if (!s) return;
			let n = f[t]?.[m];
			_(g === n ? null : n);
		},
		shape: (e) => {
			let t = f[e.index ?? 0]?.[m], n = c.includes(t), r = s && g !== null && g !== t;
			return /* @__PURE__ */ (0, Q.jsx)(S, {
				...e,
				fill: `url(#${v}-colors-${t})`,
				filter: n ? `url(#${v}-glow-${t})` : void 0,
				stroke: i < 0 ? "var(--background)" : "none",
				strokeWidth: i < 0 ? 5 : 0,
				opacity: r ? .15 : 1,
				className: "transition-opacity duration-200"
			});
		},
		...u,
		children: y
	}), /* @__PURE__ */ (0, Q.jsxs)("defs", { children: [/* @__PURE__ */ (0, Q.jsx)(Vi, {
		id: v,
		config: d,
		variant: e
	}), c.length > 0 && /* @__PURE__ */ (0, Q.jsx)(Hi, {
		id: v,
		glowingSectors: c
	})] })] });
}
var Ii = () => null;
function Li({ variant: e, roundness: t, defaultIndex: n }) {
	let { isLoading: r, nameKey: i } = Ni();
	return r ? null : /* @__PURE__ */ (0, Q.jsx)(s, {
		defaultIndex: n,
		content: /* @__PURE__ */ (0, Q.jsx)(c, {
			nameKey: i,
			hideLabel: !0,
			roundness: t,
			variant: e
		})
	});
}
function Ri({ variant: e, align: t = "center", verticalAlign: n = "bottom", isClickable: r = !1 }) {
	let { nameKey: o, selectedSector: s, selectSector: c } = Ni();
	return /* @__PURE__ */ (0, Q.jsx)(i, {
		verticalAlign: n,
		align: t,
		content: /* @__PURE__ */ (0, Q.jsx)(a, {
			selected: s,
			onSelectChange: c,
			isClickable: r,
			nameKey: o,
			variant: e
		})
	});
}
function zi({ variant: e = "dots" }) {
	return /* @__PURE__ */ (0, Q.jsx)(n, { variant: e });
}
var Bi = (e, t) => {
	let n = null;
	return Z.Children.forEach(e, (e) => {
		if (!(0, Z.isValidElement)(e) || e.type !== Ii) return;
		let { dataKey: r, labelListProps: i } = e.props;
		n = /* @__PURE__ */ (0, Q.jsx)(m, {
			dataKey: r ?? t,
			stroke: "none",
			fontSize: 12,
			fontWeight: 500,
			fill: "currentColor",
			className: "fill-background",
			...i
		});
	}), n;
}, Vi = ({ id: e, config: t }) => /* @__PURE__ */ (0, Q.jsx)(Q.Fragment, { children: Object.entries(t).map(([t, n]) => {
	let r = de(n);
	return /* @__PURE__ */ (0, Q.jsx)("linearGradient", {
		id: `${e}-colors-${t}`,
		x1: "0",
		y1: "0",
		x2: "1",
		y2: "1",
		children: r === 1 ? /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)("stop", {
			offset: "0%",
			stopColor: `var(--color-${t}-0)`
		}), /* @__PURE__ */ (0, Q.jsx)("stop", {
			offset: "100%",
			stopColor: `var(--color-${t}-0)`
		})] }) : Array.from({ length: r }, (e, n) => {
			let i = `${n / (r - 1) * 100}%`;
			return /* @__PURE__ */ (0, Q.jsx)("stop", {
				offset: i,
				stopColor: `var(--color-${t}-${n}, var(--color-${t}-0))`
			}, i);
		})
	}, `${e}-colors-${t}`);
}) }), Hi = ({ id: e, glowingSectors: t }) => /* @__PURE__ */ (0, Q.jsx)(Q.Fragment, { children: t.map((t) => /* @__PURE__ */ (0, Q.jsxs)("filter", {
	id: `${e}-glow-${t}`,
	x: "-100%",
	y: "-100%",
	width: "300%",
	height: "300%",
	children: [
		/* @__PURE__ */ (0, Q.jsx)("feGaussianBlur", {
			in: "SourceGraphic",
			stdDeviation: "8",
			result: "blur"
		}),
		/* @__PURE__ */ (0, Q.jsx)("feColorMatrix", {
			in: "blur",
			type: "matrix",
			values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0",
			result: "glow"
		}),
		/* @__PURE__ */ (0, Q.jsxs)("feMerge", { children: [/* @__PURE__ */ (0, Q.jsx)("feMergeNode", { in: "glow" }), /* @__PURE__ */ (0, Q.jsx)("feMergeNode", { in: "SourceGraphic" })] })
	]
}, `${e}-glow-${t}`)) }), Ui = Array.from({ length: Ci }, (e, t) => ({
	name: `loading${t}`,
	value: 100 / Ci
})), Wi = (e) => {
	let { index: t = 0, ...n } = e, r = t / Ci * (wi / 1e3);
	return /* @__PURE__ */ (0, Q.jsx)(mn.g, {
		initial: { opacity: .15 },
		animate: { opacity: [
			.15,
			.5,
			.15
		] },
		transition: {
			duration: wi / 1e3,
			delay: r,
			repeat: Infinity,
			ease: "easeInOut"
		},
		children: /* @__PURE__ */ (0, Q.jsx)(S, {
			...n,
			fill: "currentColor"
		})
	});
};
Pi.Pie = Fi, Pi.Label = Ii, Pi.Tooltip = Li, Pi.Legend = Ri, Pi.Background = zi;
// src/react/settings/storage-charts.tsx
var Gi = {
	database: "var(--color-chart-1)",
	backups: "var(--color-chart-2)",
	playback: "var(--color-chart-3)",
	thumbnails: "var(--color-chart-4)",
	previews: "var(--color-chart-5)",
	downloads: "var(--color-chart-6)",
	sources: "var(--color-chart-7)",
	records: "var(--color-chart-8)",
	tools: "var(--color-chart-9)"
}, Ki = "var(--color-text-tertiary)", qi = {
	database: "bg-chart-1",
	backups: "bg-chart-2",
	playback: "bg-chart-3",
	thumbnails: "bg-chart-4",
	previews: "bg-chart-5",
	downloads: "bg-chart-6",
	sources: "bg-chart-7",
	records: "bg-chart-8",
	tools: "bg-chart-9"
}, Ji = (e) => J(e);
function Yi(e) {
	let t = e.filter((e) => Gi[e.key] && e.bytes > 0).map((e) => ({
		key: e.key,
		label: e.label,
		bytes: e.bytes,
		color: Gi[e.key]
	})), n = e.filter((e) => !Gi[e.key]).reduce((e, t) => e + t.bytes, 0);
	return n > 0 ? [...t, {
		key: "rest",
		label: "其余",
		bytes: n,
		color: Ki
	}] : t;
}
function Xi({ storage: e }) {
	let t = e.usage, n = Yi(t.categories), r = Object.fromEntries(n.map((e) => [e.key, {
		label: e.label,
		colors: Ae(e.color)
	}])), i = n.map((e) => ({
		slice: e.key,
		value: e.bytes
	}));
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		className: "flex flex-col gap-5 md:flex-row md:items-center",
		children: [/* @__PURE__ */ (0, Q.jsxs)("div", {
			className: "relative mx-auto size-48 flex-none",
			role: "img",
			"aria-label": `数据目录共 ${Ji(t.total_bytes)}，各类占比`,
			children: [/* @__PURE__ */ (0, Q.jsxs)(Pi, {
				data: i,
				dataKey: "value",
				nameKey: "slice",
				config: r,
				className: "aspect-square size-48 flex-none",
				children: [/* @__PURE__ */ (0, Q.jsx)(Pi.Pie, {
					innerRadius: "68%",
					outerRadius: "100%",
					paddingAngle: 1,
					cornerRadius: 3
				}), /* @__PURE__ */ (0, Q.jsx)(o, {
					nameKey: "slice",
					hideLabel: !0,
					format: Ji
				})]
			}), /* @__PURE__ */ (0, Q.jsxs)("div", {
				className: "pointer-events-none absolute inset-0 flex flex-col items-center justify-center",
				children: [/* @__PURE__ */ (0, Q.jsx)("b", {
					className: "text-title-2-medium tabular-nums text-text-primary",
					children: Ji(t.total_bytes)
				}), /* @__PURE__ */ (0, Q.jsxs)("small", {
					className: "text-caption-1-regular tabular-nums text-text-secondary",
					children: [t.total_files.toLocaleString(), " 个文件"]
				})]
			})]
		}), /* @__PURE__ */ (0, Q.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col gap-4",
			children: [/* @__PURE__ */ (0, Q.jsx)("ul", {
				className: "flex flex-wrap gap-x-4 gap-y-1.5",
				"aria-label": "图例",
				children: n.map((e) => /* @__PURE__ */ (0, Q.jsxs)("li", {
					className: "flex items-center gap-1.5 text-caption-1-regular text-text-secondary",
					children: [
						/* @__PURE__ */ (0, Q.jsx)("i", {
							"aria-hidden": !0,
							className: `${te} ${qi[e.key] || "bg-text-tertiary"}`
						}),
						e.label,
						/* @__PURE__ */ (0, Q.jsx)("span", {
							className: "tabular-nums text-text-primary",
							children: Ji(e.bytes)
						})
					]
				}, e.key))
			}), /* @__PURE__ */ (0, Q.jsx)(Zi, { storage: e })]
		})]
	});
}
function Zi({ storage: e }) {
	if (e.total_bytes === null || e.free_bytes === null || !e.usage) return null;
	let t = Math.min(e.usage.total_bytes, e.total_bytes), n = e.free_bytes, r = Math.max(0, e.total_bytes - n - t), i = {
		peach: {
			label: "Peach 数据",
			colors: Ae("var(--color-border-focus-ring)")
		},
		others: {
			label: "其他文件",
			colors: Ae(Ki)
		},
		free: {
			label: "可用",
			colors: Ae("var(--color-background-tertiary-default)")
		}
	};
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, Q.jsxs)("p", {
			className: "text-caption-1-regular text-text-secondary",
			children: [
				"所在磁盘共 ",
				Ji(e.total_bytes),
				e.system_drive ? "（系统盘）" : "",
				"，Peach 占 ",
				((t) => {
					let n = t / e.total_bytes * 100;
					return n < .1 ? "不到 0.1%" : `${n.toFixed(+(n < 10))}%`;
				})(t),
				"， 可用 ",
				Ji(n)
			]
		}), /* @__PURE__ */ (0, Q.jsxs)(p, {
			data: [{
				disk: "磁盘",
				peach: t,
				others: r,
				free: n
			}],
			config: i,
			layout: "horizontal",
			stackType: "percent",
			barRadius: 4,
			chartProps: { margin: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			} },
			className: "aspect-auto h-6 flex-none",
			children: [
				/* @__PURE__ */ (0, Q.jsx)(p.YAxis, {
					dataKey: "disk",
					hide: !0
				}),
				/* @__PURE__ */ (0, Q.jsx)(p.XAxis, { hide: !0 }),
				/* @__PURE__ */ (0, Q.jsx)(p.Bar, { dataKey: "peach" }),
				/* @__PURE__ */ (0, Q.jsx)(p.Bar, { dataKey: "others" }),
				/* @__PURE__ */ (0, Q.jsx)(p.Bar, { dataKey: "free" }),
				/* @__PURE__ */ (0, Q.jsx)(o, {
					hideLabel: !0,
					format: Ji
				})
			]
		})]
	});
}
// src/react/settings/storage-settings.tsx
var Qi = "/api/configuration/storage", $i = 1500, ea = 864e5, ta = (e) => e instanceof qe && e.body?.errors?.target || q(e);
function na(e) {
	if (e.free_bytes === null || e.total_bytes === null) return "未取得";
	let t = `${J(e.free_bytes)} 可用，共 ${J(e.total_bytes)}`;
	return e.system_drive ? `${t}（系统盘）` : t;
}
var ra = (e) => e.cleanable && e.reclaimable > 0;
function ia({ job: e }) {
	let t = e.files || 0, n = e.expected_files || 0, r = /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [
		"已统计 ",
		/* @__PURE__ */ (0, Q.jsx)(Tr, { value: t }),
		" 个文件 · ",
		/* @__PURE__ */ (0, Q.jsx)(Tr, {
			value: e.bytes || 0,
			format: J
		})
	] });
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		"aria-live": "polite",
		className: "flex flex-col gap-2",
		children: [n ? /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)(Ot, {
			label: "统计进度",
			value: Math.min(t, n * .99),
			max: n
		}), /* @__PURE__ */ (0, Q.jsxs)(N, { children: [
			r,
			"，上次共 ",
			n.toLocaleString(),
			" 个"
		] })] }) : /* @__PURE__ */ (0, Q.jsx)(ht, { label: "正在统计占用空间" }), n ? null : /* @__PURE__ */ (0, Q.jsx)(N, { children: r })]
	});
}
function aa({ category: e, selected: t, disabled: n, onToggle: r }) {
	let i = ra(e), a = e.cleanable ? e.reclaimable > 0 ? `清理后${e.note}` : "没有可以清理的文件" : `不能清理：${e.note}`;
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		"data-category": e.key,
		className: "flex min-h-13 w-full items-start gap-3 border-b border-separator-border py-2.5 pr-3 last:border-b-0",
		children: [
			/* @__PURE__ */ (0, Q.jsx)(D, {
				"aria-label": `清理${e.label}`,
				isSelected: t,
				isDisabled: !i || n,
				onChange: r,
				className: "mt-0.5"
			}),
			/* @__PURE__ */ (0, Q.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col gap-0.5",
				children: [
					/* @__PURE__ */ (0, Q.jsxs)("p", {
						className: "flex items-center gap-2 text-body-regular text-text-primary",
						children: [/* @__PURE__ */ (0, Q.jsx)("i", {
							"aria-hidden": !0,
							className: `size-2.5 shrink-0 rounded-xs ${qi[e.key] || "bg-text-tertiary"}`
						}), e.label]
					}),
					/* @__PURE__ */ (0, Q.jsx)("p", {
						className: "text-body-2-regular text-text-secondary",
						children: e.description
					}),
					/* @__PURE__ */ (0, Q.jsx)("p", {
						className: "text-caption-1-regular text-text-tertiary",
						children: a
					})
				]
			}),
			/* @__PURE__ */ (0, Q.jsxs)("div", {
				className: "flex shrink-0 flex-col items-end gap-0.5 text-right",
				children: [/* @__PURE__ */ (0, Q.jsx)(Tr, {
					value: e.bytes,
					format: J,
					className: "text-body-regular text-text-primary"
				}), i ? /* @__PURE__ */ (0, Q.jsxs)("span", {
					className: "text-caption-1-regular text-text-secondary",
					children: ["可释放 ", J(e.reclaimable)]
				}) : null]
			})
		]
	});
}
function oa({ initial: e, receipt: t }) {
	let [n, r] = (0, Z.useState)(e), [i, a] = (0, Z.useState)(""), [o, s] = (0, Z.useState)(/* @__PURE__ */ new Set()), c = Y(), l = n.job.state !== "idle", u = (0, Z.useRef)(l);
	(0, Z.useEffect)(() => {
		if (!l) return;
		let e = new AbortController(), t = setTimeout(() => {
			W(Qi, e.signal).then(r, () => {
				e.signal.aborted || r((e) => ({ ...e }));
			});
		}, $i);
		return () => {
			e.abort(), clearTimeout(t);
		};
	}, [n]), (0, Z.useEffect)(() => {
		l ? u.current = !0 : u.current && (u.current = !1, s(/* @__PURE__ */ new Set()), n.job.error || t(n.job.message || "已统计占用空间"));
	}, [l]);
	let d = () => void c.run("measure", (e) => G(`${Qi}/measure`, {}, "POST", e), r), f = n.usage, p = f?.categories.filter(ra) ?? [], m = p.filter((e) => o.has(e.key)), h = (e, t) => {
		if (!e.length) return;
		let n = e.reduce((e, t) => e + t.reclaimable, 0);
		Qt({
			title: t,
			body: `将删除 ${J(n)}：${e.map((e) => `${e.label} ${J(e.reclaimable)}（清理后${e.note}）`).join("；")}。`,
			confirmLabel: `清理 ${J(n)}`,
			danger: e.some((e) => e.key === "backups"),
			onConfirm: async () => r(await G(`${Qi}/clean`, { categories: e.map((e) => e.key) }))
		});
	}, g = () => void c.run("relocate", async (e) => {
		let t = (await G(xt, { initial: n.data_root }, "POST", e)).path;
		if (!t) return;
		let r = n.usage ? J(n.usage.total_bytes) : "";
		await Qt({
			title: "迁移数据目录",
			body: `将 ${r} 数据从 ${n.data_root} 移到 ${t}。迁移期间 Peach 会退出，完成后自动重新打开；原位置的数据在新位置核对无误后删除。`,
			confirmLabel: "迁移数据目录",
			onConfirm: async () => {
				try {
					a((await G(`${Qi}/relocate`, { target: t })).message);
				} catch (e) {
					throw Error(ta(e));
				}
			}
		});
	}, () => void 0), _ = n.relocation.last, v = _ && (_.state === "error" || (_.notes?.length ?? 0) > 0 || Date.now() - _.finished_at * 1e3 < ea), y = f?.categories.find((e) => e.key === n.job.category)?.label, b = i || (n.job.state === "cleaning" ? `正在清理${y || ""}…` : n.job.state === "measuring" ? "正在统计占用空间…" : m.length ? `已选 ${m.length} 类，可释放 ${J(m.reduce((e, t) => e + t.reclaimable, 0))}` : f ? `统计于 ${(/* @__PURE__ */ new Date(f.measured_at * 1e3)).toLocaleString()}` : ""), x = l || !!i, S = (e) => (t) => s((n) => {
		let r = new Set(n);
		return t ? r.add(e) : r.delete(e), r;
	});
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		id: "storageSettings",
		guide: "storage",
		title: "存储空间",
		children: [
			/* @__PURE__ */ (0, Q.jsxs)(ct, { children: [/* @__PURE__ */ (0, Q.jsx)(j, {
				term: "数据目录",
				children: /* @__PURE__ */ (0, Q.jsx)(Et, {
					path: n.data_root,
					className: "text-body-regular text-text-primary",
					onRevealed: t
				})
			}), /* @__PURE__ */ (0, Q.jsx)(j, {
				term: "所在磁盘",
				children: na(n)
			})] }),
			/* @__PURE__ */ (0, Q.jsxs)(V, {
				divided: !0,
				children: [
					n.job.state === "measuring" ? /* @__PURE__ */ (0, Q.jsx)(ia, { job: n.job }) : null,
					f ? /* @__PURE__ */ (0, Q.jsxs)("div", {
						"data-storage-result": "",
						className: Jt({
							variant: "outlined",
							padding: "none",
							className: "flex flex-col"
						}),
						children: [/* @__PURE__ */ (0, Q.jsx)("div", {
							className: "border-b border-separator-border p-4",
							children: /* @__PURE__ */ (0, Q.jsx)(Xi, { storage: n })
						}), /* @__PURE__ */ (0, Q.jsx)("div", {
							className: "flex flex-col pl-4",
							children: f.categories.map((e) => /* @__PURE__ */ (0, Q.jsx)(aa, {
								category: e,
								selected: o.has(e.key),
								disabled: x,
								onToggle: S(e.key)
							}, e.key))
						})]
					}) : n.job.state === "measuring" ? null : /* @__PURE__ */ (0, Q.jsx)(N, { children: "统计后显示各类数据的占用，并可清理缓存与旧备份。" }),
					n.relocation.available ? null : /* @__PURE__ */ (0, Q.jsx)(N, { children: n.relocation.message }),
					!n.relocation.available && n.relocation.steps?.length ? /* @__PURE__ */ (0, Q.jsx)("ol", {
						className: "flex list-decimal flex-col gap-2 pl-5 text-body-2-regular text-text-secondary",
						"aria-label": "在宿主机上迁移",
						children: n.relocation.steps.map((e) => /* @__PURE__ */ (0, Q.jsxs)("li", { children: [e.text, /* @__PURE__ */ (0, Q.jsx)("code", {
							className: "mt-1 block rounded-md bg-background-tertiary-default px-2 py-1 text-caption-1-regular break-all text-text-primary",
							children: e.command
						})] }, e.command))
					}) : null,
					n.job.error ? /* @__PURE__ */ (0, Q.jsx)(k, { children: n.job.message }) : null,
					c.error ? /* @__PURE__ */ (0, Q.jsx)(k, { children: c.error }) : null,
					v && _ ? _.state === "error" ? /* @__PURE__ */ (0, Q.jsx)(k, { children: _.message }) : /* @__PURE__ */ (0, Q.jsx)(N, { children: [_.message, ..._.notes ?? []].join("；") }) : null
				]
			}),
			/* @__PURE__ */ (0, Q.jsxs)(M, {
				status: b ? /* @__PURE__ */ (0, Q.jsx)("p", {
					role: i ? "status" : void 0,
					children: b
				}) : null,
				children: [
					f ? /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)(E, {
						variant: "secondary",
						disabled: x || !m.length,
						...K(n.job.state === "cleaning" && m.length > 0),
						onClick: () => h(m, "清理所选数据"),
						children: "清理所选"
					}), /* @__PURE__ */ (0, Q.jsx)(E, {
						variant: "secondary",
						disabled: x || !p.length,
						onClick: () => h(p, "清理全部可清理的数据"),
						children: "全部清理"
					})] }) : null,
					/* @__PURE__ */ (0, Q.jsx)(E, {
						variant: "secondary",
						disabled: x || !n.relocation.available || !f,
						onClick: g,
						...K(c.busy === "relocate"),
						children: "更改位置"
					}),
					/* @__PURE__ */ (0, Q.jsx)(E, {
						disabled: !!i || n.job.state === "cleaning",
						onClick: d,
						...K(c.busy === "measure" || n.job.state === "measuring"),
						children: f ? "重新统计" : "统计占用"
					})
				]
			})
		]
	});
}
// src/react/settings/maintenance-settings.tsx
var sa = [
	["6", "每 6 小时"],
	["24", "每天"],
	["168", "每周"]
];
function ca({ data: e, receipt: t, reopenTutorial: n, panel: r }) {
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		...er(r),
		children: [
			e.storage ? /* @__PURE__ */ (0, Q.jsx)(oa, {
				initial: e.storage,
				receipt: t
			}) : null,
			e.remote_reporting || e.library_sharing ? /* @__PURE__ */ (0, Q.jsxs)(L, {
				id: "librarySharing",
				guide: "reporting",
				title: "数据上传",
				children: [e.remote_reporting ? /* @__PURE__ */ (0, Q.jsx)(Cr, {
					initial: e.remote_reporting,
					receipt: t
				}) : null, e.library_sharing ? /* @__PURE__ */ (0, Q.jsx)("div", {
					className: "border-t border-separator-border",
					children: /* @__PURE__ */ (0, Q.jsx)(xr, {
						initial: e.library_sharing,
						receipt: t
					})
				}) : null]
			}) : null,
			/* @__PURE__ */ (0, Q.jsx)(da, { facts: e.facts }),
			/* @__PURE__ */ (0, Q.jsx)(la, {
				receipt: t,
				reopenTutorial: n
			}),
			e.uninstall ? /* @__PURE__ */ (0, Q.jsx)(fa, {
				uninstall: e.uninstall,
				receipt: t
			}) : null
		]
	});
}
function la({ reopenTutorial: e }) {
	return /* @__PURE__ */ (0, Q.jsx)("section", {
		"aria-label": "新手教程",
		className: "w-full",
		children: /* @__PURE__ */ (0, Q.jsx)(It, { children: /* @__PURE__ */ (0, Q.jsx)(I, { children: /* @__PURE__ */ (0, Q.jsx)(B, {
			label: "新手教程",
			description: "在所有设备上恢复右上角教程入口，保留已读进度",
			children: /* @__PURE__ */ (0, Q.jsx)(E, {
				variant: "secondary",
				onClick: () => void e(),
				children: "重新打开"
			})
		}) }) })
	});
}
function ua({ initial: e, receipt: t }) {
	let [n, r] = (0, Z.useState)(e.mode), [i, a] = (0, Z.useState)(e.interval_hours), o = Y(e.error), s = (r) => {
		r.preventDefault(), e.available && o.run("save", (e) => G("/api/configuration/automatic-updates", {
			mode: n,
			interval_hours: i
		}, "POST", e), () => t("已保存配置"));
	}, c = e.available ? e.download_available ? "下载完成后在这里确认重启安装。" : void 0 : "自动更新需要由托盘管理的服务。";
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		id: "automaticUpdates",
		guide: "automatic-updates",
		title: "自动更新",
		onSubmit: s,
		children: [
			/* @__PURE__ */ (0, Q.jsxs)(I, { children: [
				/* @__PURE__ */ (0, Q.jsx)(B, {
					label: "自动检查新版本",
					children: /* @__PURE__ */ (0, Q.jsx)(U, {
						"aria-label": "自动检查新版本",
						isSelected: n !== "off",
						isDisabled: !e.available,
						onChange: (e) => r(e ? "check" : "off")
					})
				}),
				/* @__PURE__ */ (0, Q.jsx)(B, {
					label: "自动下载更新",
					children: /* @__PURE__ */ (0, Q.jsx)(U, {
						"aria-label": "自动下载更新",
						isSelected: n === "download",
						isDisabled: !e.available || !e.download_available || n === "off",
						onChange: (e) => r(e ? "download" : "check")
					})
				}),
				/* @__PURE__ */ (0, Q.jsx)(B, {
					label: "检查频率",
					description: c,
					children: /* @__PURE__ */ (0, Q.jsx)(R, {
						"aria-label": "检查频率",
						selectedKey: String(i),
						isDisabled: !e.available,
						onSelectionChange: (e) => {
							e !== null && a(Number(e));
						},
						children: sa.map(([e, t]) => /* @__PURE__ */ (0, Q.jsx)(z, {
							id: e,
							children: t
						}, e))
					})
				})
			] }),
			o.error ? /* @__PURE__ */ (0, Q.jsx)(V, {
				divided: !0,
				children: /* @__PURE__ */ (0, Q.jsx)(k, { children: o.error })
			}) : null,
			/* @__PURE__ */ (0, Q.jsx)(M, { children: /* @__PURE__ */ (0, Q.jsx)(E, {
				type: "submit",
				disabled: !e.available,
				...K(o.busy === "save"),
				children: "保存配置"
			}) })
		]
	});
}
function da({ facts: e }) {
	return /* @__PURE__ */ (0, Q.jsx)(L, {
		guide: "facts",
		title: "运行信息",
		children: /* @__PURE__ */ (0, Q.jsx)(ct, { children: e.map((e) => /* @__PURE__ */ (0, Q.jsxs)(j, {
			term: e.term,
			children: [e.value, e.download_url ? /* @__PURE__ */ (0, Q.jsx)(A, {
				href: e.download_url,
				children: e.download_label
			}) : null]
		}, e.term)) })
	});
}
function fa({ uninstall: e, receipt: t }) {
	let [n, r] = (0, Z.useState)(!1), [i, a] = (0, Z.useState)(""), o = () => void Qt({
		title: "卸载 Peach",
		danger: !0,
		body: n ? "将退出 Peach，移除程序、开机自启、桌面图标、设置、本地数据库、观看记录、凭据和缓存。原始媒体文件保留。" : "将退出 Peach 并移除程序、开机自启和桌面图标。设置、本地数据库、观看记录与缓存保留。",
		confirmLabel: "卸载 Peach",
		onConfirm: async () => {
			let e = await G("/api/configuration/uninstall", {
				delete_data: n,
				confirmation: "卸载 Peach"
			});
			a(e.message);
		}
	}), s = i || e.message, c = [.../* @__PURE__ */ new Set([e.data_root, ...e.directories])];
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		id: "uninstallPeach",
		guide: "uninstall",
		title: "卸载 Peach",
		children: [
			e.available ? /* @__PURE__ */ (0, Q.jsx)(V, { children: /* @__PURE__ */ (0, Q.jsx)(N, { children: "卸载移除 Peach 程序本身，原始媒体文件保留。" }) }) : null,
			/* @__PURE__ */ (0, Q.jsx)(I, { children: /* @__PURE__ */ (0, Q.jsx)(B, {
				label: "完全卸载",
				description: "同时删除设置、本地数据库、观看记录、凭据和缓存",
				children: /* @__PURE__ */ (0, Q.jsx)(U, {
					"aria-label": "完全卸载",
					isSelected: n,
					isDisabled: !e.full_available || !!i,
					onChange: r
				})
			}) }),
			/* @__PURE__ */ (0, Q.jsx)(V, {
				divided: !0,
				children: /* @__PURE__ */ (0, Q.jsx)(O, {
					summary: "数据目录",
					children: c.map((e) => /* @__PURE__ */ (0, Q.jsx)(Et, {
						path: e,
						className: "text-body-2-regular text-text-secondary",
						onRevealed: t
					}, e))
				})
			}),
			/* @__PURE__ */ (0, Q.jsx)(M, {
				status: s ? /* @__PURE__ */ (0, Q.jsx)("p", {
					role: i ? "status" : void 0,
					children: s
				}) : null,
				children: /* @__PURE__ */ (0, Q.jsx)(E, {
					variant: "danger",
					disabled: !e.available || !!i,
					onClick: o,
					children: "卸载 Peach"
				})
			})
		]
	});
}
// src/react/settings/release-updates.tsx
var pa = /* @__PURE__ */ new Set([
	"downloading",
	"verifying",
	"extracting",
	"preparing",
	"restarting",
	"installing"
]), ma = [
	65,
	75,
	90
], ha = 120, ga = "https://github.com/peach-mitao/peach/releases";
function _a({ initial: e, initialJob: t }) {
	let [n, r] = (0, Z.useState)(e), [i, a] = (0, Z.useState)(t || {
		state: "idle",
		progress: 0
	}), [o, s] = (0, Z.useState)(""), c = Y(), l = (0, Z.useRef)(!1), u = (0, Z.useRef)(!0), d = pa.has(i.state);
	(0, Z.useEffect)(() => (u.current = !0, () => {
		u.current = !1;
	}), []);
	let f = async () => {
		let e = await G("/api/configuration/update-restart", {});
		u.current && a(e);
	}, p = () => void Qt({
		title: "更新已准备好",
		body: `Peach ${i.version || ""} 将在重启后安装。`,
		confirmLabel: "立即重启",
		cancelLabel: "稍后",
		onConfirm: f
	});
	(0, Z.useEffect)(() => {
		i.state !== "ready" || l.current || (l.current = !0, p());
	}, [i.state]), (0, Z.useEffect)(() => {
		let e = new AbortController(), t = pa.has(i.state) ? 1e3 : 3e4, n, o = 0, c = async () => {
			try {
				let t = await W("/api/configuration/update-status", e.signal);
				if (e.signal.aborted) return;
				a(t), o = 0, t.state === "complete" && r((e) => ({
					...e,
					current_version: t.version || e.current_version,
					state: "current",
					message: "已是最新测试版。"
				}));
				let n = await W("/api/configuration/automatic-updates", e.signal);
				!e.signal.aborted && n.result && r(n.result);
			} catch {
				o += 1, o >= ha && !e.signal.aborted && s("尚未连接到 Peach，请检查托盘后刷新页面。");
			}
			!e.signal.aborted && o < ha && (n = setTimeout(c, t));
		};
		return n = setTimeout(c, t), () => {
			e.abort(), clearTimeout(n);
		};
	}, [i.state]);
	let m = () => {
		d || (l.current = !1, s(""), c.run("download", (e) => G("/api/configuration/update", {}, "POST", e), a));
	}, h = () => void c.run("check", (e) => W("/api/configuration/updates", e), r, (t) => {
		r({
			...e,
			state: "error"
		}), c.setError(q(t));
	}), g = c.error || o, _ = i.state === "downloading" && i.total ? `${((i.downloaded || 0) / 1048576).toFixed(1)} / ${(i.total / 1048576).toFixed(1)} MB` : `${i.progress}%`;
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		id: "releaseUpdates",
		guide: "updates",
		title: "检查更新",
		aside: /* @__PURE__ */ (0, Q.jsx)(H, {
			tone: g || n.state === "error" || i.state === "error" ? "error" : d ? "progress" : n.state === "available" ? "warning" : n.state === "unchecked" ? "neutral" : "success",
			children: g || n.state === "error" || i.state === "error" ? "检查未完成" : d ? "准备更新中" : i.state === "ready" ? "可安装" : n.state === "available" ? "有可用更新" : n.state === "unchecked" ? "尚未检查" : "检查完成"
		}),
		children: [
			/* @__PURE__ */ (0, Q.jsxs)(ct, { children: [
				/* @__PURE__ */ (0, Q.jsx)(j, {
					term: "当前版本",
					children: n.current_version
				}),
				/* @__PURE__ */ (0, Q.jsx)(j, {
					term: "安装方式",
					children: n.installation
				}),
				/* @__PURE__ */ (0, Q.jsx)(j, {
					term: "更新通道",
					children: n.channel
				}),
				/* @__PURE__ */ (0, Q.jsx)(j, {
					term: "最新版本",
					children: n.latest_version || "未取得"
				}),
				n.package_kind ? /* @__PURE__ */ (0, Q.jsxs)(j, {
					term: "下载内容",
					children: [n.package_kind === "update" ? "应用更新包" : n.package_kind === "installer" ? "macOS 安装镜像" : "应用与工具", n.asset_size ? ` · ${(n.asset_size / 1048576).toFixed(1)} MB` : ""]
				}) : null
			] }),
			n.package_kind === "update" ? /* @__PURE__ */ (0, Q.jsx)(N, { children: "应用更新包复用已安装工具；工具缺失、损坏或版本变化时会另行下载所需工具包。" }) : n.package_kind === "full" ? /* @__PURE__ */ (0, Q.jsx)(N, { children: "本次更新包含媒体工具。" }) : n.package_kind === "installer" ? /* @__PURE__ */ (0, Q.jsx)(N, { children: "下载后打开镜像，把 Peach 拖入「应用程序」替换旧版本，数据目录与设置保留；提示已损坏时按发布页说明移除隔离标记。" }) : null,
			n.state === "unchecked" && !n.checked_at && !g && i.state === "idle" ? null : /* @__PURE__ */ (0, Q.jsxs)(V, {
				divided: !0,
				children: [
					n.checked_at ? /* @__PURE__ */ (0, Q.jsxs)(N, { children: ["检查于 ", (/* @__PURE__ */ new Date(n.checked_at * 1e3)).toLocaleString()] }) : null,
					n.state === "available" && !g ? /* @__PURE__ */ (0, Q.jsx)(F, {
						tone: "info",
						title: "有可用更新",
						children: n.message
					}) : g || n.state === "error" ? /* @__PURE__ */ (0, Q.jsx)(k, { children: g || n.message }) : n.state === "unchecked" ? null : /* @__PURE__ */ (0, Q.jsx)(N, {
						role: "status",
						children: n.message
					}),
					i.state === "error" ? /* @__PURE__ */ (0, Q.jsx)(k, { children: i.message }) : null,
					i.state !== "idle" && i.state !== "error" ? /* @__PURE__ */ (0, Q.jsxs)("div", {
						"aria-live": "polite",
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, Q.jsx)(Ot, {
								label: "更新准备进度",
								value: i.progress,
								stops: ma
							}),
							/* @__PURE__ */ (0, Q.jsxs)(N, { children: ["下载 → 校验 → 解压 → 准备安装 · ", i.message] }),
							/* @__PURE__ */ (0, Q.jsx)(N, { children: _ })
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, Q.jsxs)(M, {
				status: /* @__PURE__ */ (0, Q.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [
						/* @__PURE__ */ (0, Q.jsx)(A, {
							href: "https://peach.video/#download",
							children: "官网"
						}),
						/* @__PURE__ */ (0, Q.jsx)(A, {
							href: "https://github.com/peach-mitao/peach",
							children: "GitHub"
						}),
						/* @__PURE__ */ (0, Q.jsx)(A, {
							href: n.release_url || ga,
							children: "查看发布页"
						})
					]
				}),
				children: [
					/* @__PURE__ */ (0, Q.jsx)(E, {
						variant: i.state === "ready" || n.state === "available" && n.installation === "独立测试包" ? "secondary" : "primary",
						disabled: d,
						onClick: h,
						...K(c.busy === "check"),
						children: "检查更新"
					}),
					n.state === "available" && n.in_app_update && i.state !== "ready" ? /* @__PURE__ */ (0, Q.jsx)(E, {
						variant: "primary",
						onClick: m,
						...K(d || c.busy === "download"),
						children: "下载并安装"
					}) : n.state === "available" && n.installation === "独立测试包" && n.asset_url ? /* @__PURE__ */ (0, Q.jsx)(Je, {
						variant: "primary",
						href: n.asset_url,
						children: "下载新版本"
					}) : null,
					i.state === "ready" ? /* @__PURE__ */ (0, Q.jsx)(E, {
						variant: "primary",
						onClick: p,
						children: "重启安装"
					}) : null
				]
			})
		]
	});
}
// src/react/settings/upgrade-repairs.tsx
var va = {
	pending: "等待修复",
	running: "正在修复",
	failed: "需要重试",
	review: "需要复核",
	complete: "已完成",
	unavailable: "当前部署未启用"
};
function ya() {
	let { snapshot: e } = Mn(), [t, n] = (0, Z.useState)(null), r = Y();
	(0, Z.useEffect)(() => n(null), [e]);
	let i = t ?? e?.repairs, a = i?.state || "pending", o = i?.items.reduce((e, t) => e + (t.pending || 0), 0) || 0, s = i?.items.reduce((e, t) => e + (t.failed || 0), 0) || 0, c = i?.items.reduce((e, t) => e + (t.review_count || 0), 0) || 0;
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		id: "upgradeRepairs",
		title: "自动修复",
		aside: /* @__PURE__ */ (0, Q.jsx)(H, {
			tone: a === "failed" ? "error" : a === "running" ? "progress" : a === "review" ? "warning" : a === "complete" ? "success" : "neutral",
			children: /* @__PURE__ */ (0, Q.jsx)("span", {
				"data-copy-key": `upgradeRepairs.${a}.status`,
				children: va[a] || "未取得"
			}, a)
		}),
		children: [
			/* @__PURE__ */ (0, Q.jsx)(V, { children: /* @__PURE__ */ (0, Q.jsx)(N, { children: "升级后自动修正资料、更新缓存。" }) }),
			/* @__PURE__ */ (0, Q.jsxs)(ct, { children: [
				/* @__PURE__ */ (0, Q.jsx)(j, {
					term: "待完成",
					children: /* @__PURE__ */ (0, Q.jsxs)("span", { children: [/* @__PURE__ */ (0, Q.jsx)(Tr, { value: o }), " 项"] })
				}),
				/* @__PURE__ */ (0, Q.jsx)(j, {
					term: "失败",
					children: /* @__PURE__ */ (0, Q.jsxs)("span", { children: [/* @__PURE__ */ (0, Q.jsx)(Tr, { value: s }), " 项"] })
				}),
				/* @__PURE__ */ (0, Q.jsx)(j, {
					term: "待复核",
					children: /* @__PURE__ */ (0, Q.jsxs)("span", { children: [/* @__PURE__ */ (0, Q.jsx)(Tr, { value: c }), " 项"] })
				})
			] }),
			i?.message || r.error ? /* @__PURE__ */ (0, Q.jsx)(V, { children: /* @__PURE__ */ (0, Q.jsx)(k, { children: r.error || i?.message }) }) : null,
			a === "running" ? /* @__PURE__ */ (0, Q.jsxs)(V, { children: [/* @__PURE__ */ (0, Q.jsx)(N, { children: "资料与预览正在后台补全。" }), /* @__PURE__ */ (0, Q.jsx)(Vt, {})] }) : null,
			/* @__PURE__ */ (0, Q.jsx)(M, {
				status: c ? /* @__PURE__ */ (0, Q.jsx)(A, {
					href: "/api/configuration/upgrade-repairs/review",
					children: "下载复核记录"
				}) : void 0,
				children: /* @__PURE__ */ (0, Q.jsx)(E, {
					size: "small",
					variant: "secondary",
					disabled: !i?.available || a === "running" || !!r.busy || !s && a !== "failed",
					onClick: () => void r.run("retry", (e) => G("/api/configuration/upgrade-repairs/retry", {}, "POST", e), (e) => {
						n(e), document.dispatchEvent(new Event("peach:client-updates"));
					}),
					children: "重试失败项"
				})
			})
		]
	});
}
// src/react/settings/general-settings.tsx
function ba({ data: e, receipt: t, panel: n }) {
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		...er(n),
		children: [
			e.updates ? /* @__PURE__ */ (0, Q.jsx)(_a, {
				initial: e.updates,
				initialJob: e.update_job
			}) : null,
			/* @__PURE__ */ (0, Q.jsx)(ya, {}),
			e.automatic_updates ? /* @__PURE__ */ (0, Q.jsx)(ua, {
				initial: e.automatic_updates,
				receipt: t
			}) : null,
			e.startup ? /* @__PURE__ */ (0, Q.jsx)(xa, {
				startup: e.startup,
				receipt: t
			}) : null
		]
	});
}
function xa({ startup: e, receipt: t }) {
	let [n, r] = (0, Z.useState)(e.enabled), [i, a] = (0, Z.useState)(e.silent), [o, s] = (0, Z.useState)(e.desktop), c = Y(), l = e.available && !e.desktop_message;
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		guide: "startup",
		title: "开机自启",
		onSubmit: (r) => {
			r.preventDefault(), e.available && c.run("save", (e) => G("/api/configuration/startup", {
				enabled: n,
				silent: i,
				desktop: o
			}, "POST", e), () => t("已保存配置"));
		},
		children: [
			/* @__PURE__ */ (0, Q.jsxs)(I, { children: [
				/* @__PURE__ */ (0, Q.jsx)(B, {
					label: "开机后启动 Peach",
					children: /* @__PURE__ */ (0, Q.jsx)(U, {
						"aria-label": "开机后启动 Peach",
						isSelected: n,
						isDisabled: !e.available,
						onChange: r
					})
				}),
				/* @__PURE__ */ (0, Q.jsx)(B, {
					label: "只启动托盘，不打开网页",
					children: /* @__PURE__ */ (0, Q.jsx)(U, {
						"aria-label": "只启动托盘，不打开网页",
						isSelected: i,
						isDisabled: !e.available || !n,
						onChange: a
					})
				}),
				/* @__PURE__ */ (0, Q.jsx)(B, {
					label: "在桌面创建快捷方式",
					description: e.desktop_message || void 0,
					children: /* @__PURE__ */ (0, Q.jsx)(U, {
						"aria-label": "在桌面创建快捷方式",
						isSelected: o,
						isDisabled: !l,
						onChange: s
					})
				})
			] }),
			e.message || c.error ? /* @__PURE__ */ (0, Q.jsxs)(V, {
				divided: !0,
				children: [e.message ? /* @__PURE__ */ (0, Q.jsx)(N, { children: e.message }) : null, c.error ? /* @__PURE__ */ (0, Q.jsx)(k, { children: c.error }) : null]
			}) : null,
			/* @__PURE__ */ (0, Q.jsx)(M, { children: /* @__PURE__ */ (0, Q.jsx)(E, {
				type: "submit",
				disabled: !e.available,
				...K(c.busy === "save"),
				children: "保存配置"
			}) })
		]
	});
}
// src/react/restart-redirect.ts
var Sa = 8e3, Ca = [
	{
		name: "机械硬盘，或内存 8 GB 以内",
		cache: "10–20 GiB",
		read: "256 / 128 KB",
		task: "1 个"
	},
	{
		name: "SATA SSD，内存 8–16 GB",
		cache: "20–50 GiB",
		read: "256 / 128 KB",
		task: "1–2 个"
	},
	{
		name: "NVMe SSD，内存 16 GB 以上",
		cache: "50–100 GiB",
		read: "256 / 128 KB",
		task: "2 个起步"
	}
], wa = [
	["cache", "缓存上限"],
	["read", "读取长度（默认 / 最小）"],
	["task", "同时处理视频"]
];
function Ta() {
	return /* @__PURE__ */ (0, Q.jsx)("div", {
		className: "@container flex flex-col gap-3",
		children: /* @__PURE__ */ (0, Q.jsxs)(O, {
			summary: "CloudDrive 设置帮助",
			children: [
				/* @__PURE__ */ (0, Q.jsxs)(N, { children: ["先将 CloudDrive2 或 OpenList 中的网盘挂载为本机文件夹，再在这里选择。", /* @__PURE__ */ (0, Q.jsx)(A, {
					href: "https://www.clouddrive2.com/help.html",
					children: "挂载帮助"
				})] }),
				/* @__PURE__ */ (0, Q.jsx)(N, { children: "缓存按所在硬盘和可用内存选起步值，再根据播放表现调整。" }),
				/* @__PURE__ */ (0, Q.jsx)(N, { children: "文件操作需要挂载工具和网盘账号授予写入权限。光鸭云盘的上传、建文件夹、改名和移动需要 CloudDrive2 v1.1.0 或更高版本，删除和复制暂不支持。" }),
				/* @__PURE__ */ (0, Q.jsx)("ul", {
					"aria-label": "按缓存所在硬盘分档",
					className: "flex flex-col gap-2",
					children: Ca.map((e) => /* @__PURE__ */ (0, Q.jsxs)("li", {
						className: "flex flex-col gap-2 rounded-2lg border border-separator-border bg-background-primary-default p-3",
						children: [/* @__PURE__ */ (0, Q.jsx)("p", {
							className: "text-body-medium text-text-primary",
							children: e.name
						}), /* @__PURE__ */ (0, Q.jsx)("dl", {
							className: "inline-grid grid-cols-1 gap-2 @md:grid-cols-3",
							children: wa.map(([t, n]) => /* @__PURE__ */ (0, Q.jsxs)("div", {
								className: "flex flex-col",
								children: [/* @__PURE__ */ (0, Q.jsx)("dt", {
									className: "text-caption-1-regular text-text-secondary",
									children: n
								}), /* @__PURE__ */ (0, Q.jsx)("dd", {
									className: "text-body-regular text-text-primary",
									children: e[t]
								})]
							}, t))
						})]
					}, e.name))
				}),
				/* @__PURE__ */ (0, Q.jsxs)("ul", {
					className: "flex list-disc flex-col gap-1 pl-5 text-body-2-regular text-text-secondary",
					children: [
						/* @__PURE__ */ (0, Q.jsx)("li", { children: "缓存上限和清理方式填在 CloudDrive「设置」里，清理方式选 LRU。上限不要填 0，系统盘至少留 40 GiB；填完重开设置页确认存住了。" }),
						/* @__PURE__ */ (0, Q.jsx)("li", { children: "读取长度和下载线程填在每个网盘各自的下载设置里，线程都从 2 开始。" }),
						/* @__PURE__ */ (0, Q.jsx)("li", { children: "Buffer Cache 占内存，磁盘缓存和文件夹缓存占硬盘，改一个管不住另外两个。" })
					]
				}),
				/* @__PURE__ */ (0, Q.jsx)(N, { children: /* @__PURE__ */ (0, Q.jsx)(A, {
					href: "https://github.com/peach-mitao/peach/blob/master/docs/CLOUDDRIVE.md",
					children: "完整配置与调优说明"
				}) })
			]
		})
	});
}
// src/react/settings/cloud-proxy-settings.tsx
var Ea = "/api/configuration/cloud-proxies", Da = [
	["direct", "直连"],
	["system", "跟随系统"],
	["http", "HTTP 代理"],
	["socks5", "SOCKS5 代理"]
];
function Oa({ receipt: e }) {
	let [t, n] = (0, Z.useState)(null), [r, i] = (0, Z.useState)(!0), a = (0, Z.useRef)(/* @__PURE__ */ new Set()), o = (0, Z.useRef)(/* @__PURE__ */ new Set()), [s, c] = (0, Z.useState)(!1), l = (0, Z.useRef)(() => void 0), u = Y(), d = () => {
		o.current.size || u.run("refresh", (e) => W(Ea, e), (e) => {
			a.current.clear(), n(e), i(!1);
		}, (e) => {
			i(!1), u.setError(e instanceof Error ? e.message : "无法读取网盘代理");
		});
	};
	return l.current = d, (0, Z.useEffect)(() => {
		l.current();
		let e = () => {
			a.current.size || l.current();
		};
		return window.addEventListener("focus", e), () => window.removeEventListener("focus", e);
	}, []), (0, Z.useEffect)(() => {
		if (!t) return;
		let e = (e) => e.mode === "http" || e.mode === "socks5";
		Sn("cloudProxy", {
			configured: t.configured !== !1,
			unlinked: t.unlinked?.length ?? 0,
			accounts: t.accounts.map((t) => [e(t.data), e(t.api)])
		});
	}, [t]), r ? /* @__PURE__ */ (0, Q.jsx)(Nt, {
		label: "正在读取网盘代理",
		html: Yt
	}) : /* @__PURE__ */ (0, Q.jsxs)(L, {
		guide: "cloud-proxy",
		title: "CloudDrive 代理",
		children: [/* @__PURE__ */ (0, Q.jsxs)(V, { children: [/* @__PURE__ */ (0, Q.jsx)(N, { children: Xe }), /* @__PURE__ */ (0, Q.jsxs)("div", {
			className: "flex min-w-0 flex-col gap-4",
			children: [
				u.error ? /* @__PURE__ */ (0, Q.jsxs)(F, {
					tone: "error",
					title: "没有读取配置",
					children: [
						u.error,
						" ",
						/* @__PURE__ */ (0, Q.jsx)(mt, {
							href: "/settings/downloads",
							size: "small",
							children: "下载设置"
						})
					]
				}) : null,
				t?.configured === !1 ? /* @__PURE__ */ (0, Q.jsxs)(N, { children: ["填写 CloudDrive2 地址和 API 令牌后，在这里设置各网盘账号的代理。 ", /* @__PURE__ */ (0, Q.jsx)(mt, {
					href: "/settings/downloads",
					size: "small",
					children: "下载设置"
				})] }) : t?.accounts.length === 0 && !t.unlinked?.length ? /* @__PURE__ */ (0, Q.jsx)(N, { children: "还没有使用 CloudDrive 的媒体库。" }) : null,
				t?.unlinked?.map((e) => /* @__PURE__ */ (0, Q.jsxs)("div", {
					className: "flex min-w-0 flex-col gap-1",
					children: [/* @__PURE__ */ (0, Q.jsx)(lt, { children: /* @__PURE__ */ (0, Q.jsxs)("span", {
						className: "inline-flex items-center gap-2",
						children: [/* @__PURE__ */ (0, Q.jsx)(zt, { mark: Yn(e.location) }), e.name]
					}) }), /* @__PURE__ */ (0, Q.jsx)(N, { children: "尚未匹配 CloudDrive 账号" })]
				}, e.root)),
				t?.accounts.map((t) => /* @__PURE__ */ (0, Q.jsx)(ka, {
					initial: t,
					receipt: e,
					onDirty: () => a.current.add(t.id),
					onSaving: (e) => {
						e ? o.current.add(t.id) : o.current.delete(t.id), c(!!o.current.size);
					},
					onSaved: (e) => {
						a.current.delete(e.id), n((t) => t && {
							...t,
							accounts: t.accounts.map((t) => t.id === e.id ? e : t)
						});
					}
				}, t.id + t.revision))
			]
		})] }), /* @__PURE__ */ (0, Q.jsx)(M, { children: /* @__PURE__ */ (0, Q.jsx)(E, {
			variant: "secondary",
			disabled: s,
			onClick: d,
			...K(u.busy === "refresh"),
			children: "重新读取"
		}) })]
	});
}
function ka({ initial: e, receipt: t, onDirty: n, onSaved: r, onSaving: i }) {
	let [a, o] = (0, Z.useState)(e), [s, c] = (0, Z.useState)([]), l = a.libraries?.map((e) => e.name).join("、") || a.name, u = Y(), d = (e, t) => {
		o((n) => ({
			...n,
			[e]: t
		})), c((t) => t.includes(e) ? t : [...t, e]), n();
	};
	return /* @__PURE__ */ (0, Q.jsxs)("form", {
		"aria-label": `${l} 代理`,
		onSubmit: (e) => {
			e.preventDefault(), i(!0), u.run("save", (e) => G(Ea, {
				id: a.id,
				revision: a.revision,
				...s.includes("api") ? { api: a.api } : {},
				...s.includes("data") ? { data: a.data } : {}
			}, "POST", e), (e) => {
				o(e), c([]), r(e), t("已保存 CloudDrive 代理");
			}).finally(() => i(!1));
		},
		className: "flex min-w-0 flex-col gap-4 border-t border-separator-border pt-4",
		children: [
			/* @__PURE__ */ (0, Q.jsx)(lt, { children: /* @__PURE__ */ (0, Q.jsxs)("span", {
				className: "inline-flex items-center gap-2",
				children: [/* @__PURE__ */ (0, Q.jsx)(zt, { mark: Yn(a.libraries?.[0]?.location || (a.cloud === "115open" ? "115" : a.cloud.toLowerCase())) }), l]
			}) }),
			/* @__PURE__ */ (0, Q.jsxs)(N, { children: [
				a.name,
				" · ",
				a.path
			] }),
			/* @__PURE__ */ (0, Q.jsx)(Aa, {
				label: "数据代理",
				value: a.data,
				disabled: !a.writable || !!u.busy,
				onChange: (e) => d("data", e)
			}),
			/* @__PURE__ */ (0, Q.jsx)(Aa, {
				label: "API 代理",
				value: a.api,
				disabled: !a.writable || !!u.busy,
				onChange: (e) => d("api", e)
			}),
			a.writable ? null : /* @__PURE__ */ (0, Q.jsx)(N, { children: "API 令牌需要“修改云盘”权限才能保存。" }),
			u.error ? /* @__PURE__ */ (0, Q.jsx)(F, {
				tone: "error",
				title: "没有保存",
				children: u.error
			}) : null,
			/* @__PURE__ */ (0, Q.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, Q.jsx)(E, {
					type: "submit",
					disabled: !a.writable || !s.length,
					...K(u.busy === "save"),
					children: "保存配置"
				})
			})
		]
	});
}
function Aa({ label: e, value: t, disabled: n, onChange: r }) {
	let i = t.mode === "http" || t.mode === "socks5";
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, Q.jsx)(lt, { children: e }),
			/* @__PURE__ */ (0, Q.jsxs)(R, {
				"aria-label": e,
				selectedKey: t.mode,
				isDisabled: n,
				onSelectionChange: (e) => {
					e && r({
						...t,
						mode: String(e)
					});
				},
				children: [t.mode === "unknown" ? /* @__PURE__ */ (0, Q.jsx)(z, {
					id: "unknown",
					children: "无法识别的代理类型"
				}) : null, Da.map(([e, t]) => /* @__PURE__ */ (0, Q.jsx)(z, {
					id: e,
					children: t
				}, e))]
			}),
			i ? /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsxs)("div", {
				className: "flex flex-wrap gap-3",
				children: [/* @__PURE__ */ (0, Q.jsx)(P, {
					className: "min-w-40 flex-1",
					label: `${e}地址`,
					value: t.host,
					autoComplete: "off",
					isDisabled: n,
					onChange: (e) => r({
						...t,
						host: e
					})
				}), /* @__PURE__ */ (0, Q.jsx)(P, {
					className: "w-full sm:w-28",
					label: `${e}端口`,
					value: t.port ? String(t.port) : "",
					inputMode: "numeric",
					isDisabled: n,
					onChange: (e) => r({
						...t,
						port: Number(e)
					})
				})]
			}), /* @__PURE__ */ (0, Q.jsxs)(O, {
				summary: "代理认证",
				children: [
					/* @__PURE__ */ (0, Q.jsx)(P, {
						label: `${e}用户名`,
						value: t.username,
						autoComplete: "off",
						isDisabled: n,
						onChange: (e) => r({
							...t,
							username: e
						})
					}),
					/* @__PURE__ */ (0, Q.jsx)(P, {
						label: `${e}密码`,
						type: "password",
						value: t.password || "",
						autoComplete: "new-password",
						isDisabled: n,
						placeholder: t.password_set ? "已保存，留空不改" : "可选",
						onChange: (e) => r({
							...t,
							password: e
						})
					}),
					t.password_set ? /* @__PURE__ */ (0, Q.jsx)(D, {
						isSelected: !!t.clear_password,
						isDisabled: n,
						onChange: (e) => r({
							...t,
							clear_password: e
						}),
						children: "清除已保存的密码"
					}) : null
				]
			})] }) : null
		]
	});
}
// src/react/settings/library-icon-picker.tsx
var ja = [
	["", "自动识别"],
	["hard-drive", "磁盘"],
	["database", "资料库"],
	["heart", "心动"],
	["heart-hand", "亲密"],
	["flame", "热情"],
	["cherry", "樱桃"],
	["lollipop", "甜心"],
	["candy", "糖果"],
	["banana", "香蕉"],
	["droplets", "湿润"],
	["venus", "女性"],
	["mars", "男性"],
	["venus-and-mars", "情侣"],
	["gem", "精选"],
	["crown", "女王"],
	["ribbon", "丝带"],
	["shirt", "制服"],
	["graduation-cap", "学生"],
	["stethoscope", "护士"],
	["glasses", "眼镜"],
	["footprints", "足迹"],
	["hand", "手部"],
	["flower", "花朵"],
	["venetian-mask", "角色扮演"],
	["rabbit", "兔女郎"],
	["paw-print", "兽耳"],
	["dumbbell", "健身"],
	["bed-double", "卧室"],
	["bath", "浴室"],
	["key-round", "私密"],
	["wine", "微醺"],
	["cigarette", "烟"],
	["moon", "夜色"],
	["sparkles", "幻想"],
	["camera", "写真"],
	["video", "影片"],
	["film", "电影"],
	["image", "图集"],
	["gamepad-2", "游戏"],
	["star", "收藏"],
	["tags", "主题"]
];
function Ma(e) {
	let t = e === "local" ? "" : yt[e];
	return t ? [t, "自动识别"] : ["hard-drive", "默认"];
}
var Na = "auto";
function Pa({ value: e, label: t, kind: n = "local", onChange: r }) {
	let i = (0, Z.useRef)(null), [a, o] = (0, Z.useState)(!1), [s, c] = (0, Z.useState)(e), [l, u] = Ma(n);
	return /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)(E, {
		ref: i,
		variant: "secondary",
		className: "self-start",
		"aria-label": t,
		"aria-haspopup": "dialog",
		"aria-expanded": a,
		onClick: () => {
			c(e), o(!0);
		},
		children: /* @__PURE__ */ (0, Q.jsxs)("span", {
			"data-icon-choice": !0,
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, Q.jsx)(zt, { mark: e || l }), ((e) => e && ja.find(([t]) => t === e)?.[1] || u)(e)]
		})
	}), /* @__PURE__ */ (0, Q.jsx)(ze, {
		triggerRef: i,
		isOpen: a,
		onOpenChange: o,
		placement: "bottom start",
		offset: 4,
		className: bt,
		children: /* @__PURE__ */ (0, Q.jsxs)(Ue, {
			"aria-label": `${t}可选图标`,
			className: "flex w-72 flex-col gap-3 outline-none",
			children: [
				/* @__PURE__ */ (0, Q.jsx)(Le, {
					slot: "title",
					className: "px-1 text-body-medium text-text-primary",
					children: "选择媒体库图标"
				}),
				/* @__PURE__ */ (0, Q.jsx)(We, {
					"aria-label": "可选图标",
					value: s || Na,
					onChange: (e) => c(e === Na ? "" : e),
					className: "inline-grid grid-cols-7 gap-1",
					children: ja.map(([e, t]) => /* @__PURE__ */ (0, Q.jsx)(Ge, {
						value: e || Na,
						"aria-label": e ? t : u,
						className: "flex h-10 cursor-pointer items-center justify-center rounded-lg text-foreground-icon-secondary outline-none hover:bg-dropdown-item-hover-background focus-visible:ring-2 focus-visible:ring-border-focus-ring data-selected:bg-dropdown-item-hover-background data-selected:text-text-primary",
						children: /* @__PURE__ */ (0, Q.jsx)(zt, { mark: e || l })
					}, e || Na))
				}),
				/* @__PURE__ */ (0, Q.jsxs)("div", {
					className: "flex justify-end gap-2 border-t border-separator-border pt-2.5",
					children: [/* @__PURE__ */ (0, Q.jsx)(E, {
						variant: "secondary",
						onClick: () => o(!1),
						children: "取消"
					}), /* @__PURE__ */ (0, Q.jsx)(E, {
						disabled: s === e,
						onClick: () => {
							r(s), o(!1);
						},
						children: "应用"
					})]
				})
			]
		})
	})] });
}
// src/react/settings/library-policy-settings.tsx
var Fa = [
	["probe", "读取视频信息"],
	["metadata", "联网补资料"],
	["cover", "联网补封面"],
	["people", "联网补人物图片"],
	["preview", "生成九宫格预览"]
], Ia = [
	"probe",
	"metadata",
	"cover",
	"people",
	"preview"
], La = [
	[
		"auto",
		"自动补全",
		"缺什么联网补什么"
	],
	[
		"local",
		"仅使用本地资料",
		"不联网，只用本地 NFO 和图片"
	],
	[
		"custom",
		"自定义",
		"逐项选择要做的步骤"
	]
];
function Ra() {
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		"data-policy-legend": "",
		className: "flex flex-col gap-1",
		children: [/* @__PURE__ */ (0, Q.jsx)(N, { children: Tt }), /* @__PURE__ */ (0, Q.jsxs)(O, {
			summary: "三种处理方式对比",
			children: [/* @__PURE__ */ (0, Q.jsxs)("table", {
				"data-policy-matrix": "",
				className: "text-body-2-regular",
				children: [/* @__PURE__ */ (0, Q.jsx)("thead", { children: /* @__PURE__ */ (0, Q.jsxs)("tr", { children: [/* @__PURE__ */ (0, Q.jsx)("th", {
					scope: "col",
					children: /* @__PURE__ */ (0, Q.jsx)(He, { children: "步骤" })
				}), St.map((e) => /* @__PURE__ */ (0, Q.jsx)("th", {
					scope: "col",
					children: e
				}, e))] }) }), /* @__PURE__ */ (0, Q.jsx)("tbody", { children: wt.map(([e, ...t]) => /* @__PURE__ */ (0, Q.jsxs)("tr", { children: [/* @__PURE__ */ (0, Q.jsx)("th", {
					scope: "row",
					children: e
				}), t.map((e, t) => /* @__PURE__ */ (0, Q.jsx)("td", {
					"data-policy-cell": e === "✓" ? "on" : e === "—" ? "off" : "choice",
					children: e === "✓" ? /* @__PURE__ */ (0, Q.jsx)("span", {
						"aria-label": "做",
						children: "✓"
					}) : e === "—" ? /* @__PURE__ */ (0, Q.jsx)("span", {
						"aria-label": "不做",
						children: "—"
					}) : e
				}, St[t]))] }, e)) })]
			}), /* @__PURE__ */ (0, Q.jsx)(N, { children: Ct })]
		})]
	});
}
function za({ name: e, value: t, onChange: n }) {
	return /* @__PURE__ */ (0, Q.jsx)(Ft, {
		"data-guide-target": "library-policy",
		className: "w-full",
		"aria-label": `${e} 处理方式`,
		selectedKey: t,
		prefix: "处理方式",
		renderValue: /* @__PURE__ */ (0, Q.jsx)("span", {
			className: "truncate",
			children: La.find(([e]) => e === t)?.[1]
		}),
		onSelectionChange: (e) => n(String(e)),
		children: La.map(([e, t, n]) => /* @__PURE__ */ (0, Q.jsx)(z, {
			id: e,
			textValue: t,
			children: /* @__PURE__ */ (0, Q.jsxs)("span", {
				className: "flex min-w-0 flex-col",
				children: [/* @__PURE__ */ (0, Q.jsx)("span", { children: t }), /* @__PURE__ */ (0, Q.jsx)("span", {
					className: "text-body-2-regular text-text-secondary whitespace-normal",
					children: n
				})]
			})
		}, e))
	});
}
function Ba({ name: e, value: t, onChange: n }) {
	return /* @__PURE__ */ (0, Q.jsx)(O, {
		defaultOpen: !0,
		summary: `${e} 的处理步骤（${t.length}/${Fa.length}）`,
		children: /* @__PURE__ */ (0, Q.jsx)("div", {
			className: "flex flex-wrap gap-x-6 gap-y-2",
			role: "group",
			"aria-label": `${e} 处理步骤`,
			children: Fa.map(([e, r]) => /* @__PURE__ */ (0, Q.jsx)(D, {
				isSelected: t.includes(e),
				onChange: (r) => n(r ? [...t, e] : t.filter((t) => t !== e)),
				children: r
			}, e))
		})
	});
}
function Va({ id: e, name: t, value: n, onChange: r }) {
	let i = (0, Z.useRef)(null), [a, o] = (0, Z.useState)(!1), s = Ke.find(([e]) => e === n)?.[1] || "无颜色", c = (t) => {
		r(t), _n(e, t), o(!1);
	};
	return /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsxs)("button", {
		ref: i,
		type: "button",
		className: "text-body-medium",
		"data-glow-chip": "",
		"data-library-color-trigger": "",
		"aria-haspopup": "dialog",
		"aria-expanded": a,
		"aria-label": `${t || "未命名媒体库"} 来源色：${s}`,
		title: s,
		onClick: () => o(!0),
		children: [
			/* @__PURE__ */ (0, Q.jsx)("span", {
				"aria-hidden": !0,
				className: "text-text-tertiary",
				children: "来源色"
			}),
			n ? /* @__PURE__ */ (0, Q.jsx)("span", {
				"data-glow-ball": "",
				"aria-hidden": "true",
				"data-accent-ball": n
			}) : /* @__PURE__ */ (0, Q.jsx)("span", {
				"data-glow-ball": "",
				"data-library-none": "",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, Q.jsx)("span", { children: s })
		]
	}), /* @__PURE__ */ (0, Q.jsx)(Be, {
		getContainer: () => hn(i.current),
		children: /* @__PURE__ */ (0, Q.jsx)(ze, {
			triggerRef: i,
			isOpen: a,
			onOpenChange: o,
			placement: "bottom start",
			offset: 8,
			containerPadding: 12,
			className: bt,
			children: /* @__PURE__ */ (0, Q.jsxs)(Ue, {
				"aria-label": `${t || "未命名媒体库"} 来源色`,
				className: "outline-none",
				children: [/* @__PURE__ */ (0, Q.jsx)("p", {
					className: "px-1 pb-2 text-body-medium text-text-primary",
					children: "选择来源色"
				}), /* @__PURE__ */ (0, Q.jsxs)("div", {
					"data-accent-grid": "",
					"data-library-colors": "",
					role: "group",
					children: [/* @__PURE__ */ (0, Q.jsx)("button", {
						type: "button",
						"data-glow-chip": "",
						"aria-pressed": !n,
						title: "无颜色",
						"aria-label": "无颜色",
						onClick: () => c(""),
						children: /* @__PURE__ */ (0, Q.jsx)("span", {
							"data-glow-ball": "",
							"data-library-none": "",
							"aria-hidden": "true"
						})
					}), Ke.map(([e, t]) => /* @__PURE__ */ (0, Q.jsx)("button", {
						type: "button",
						"data-glow-chip": "",
						"aria-pressed": e === n,
						title: t,
						"aria-label": t,
						onClick: () => c(e),
						children: /* @__PURE__ */ (0, Q.jsx)("span", {
							"data-glow-ball": "",
							"aria-hidden": "true",
							"data-accent-ball": e
						})
					}, e))]
				})]
			})
		})
	})] });
}
// src/react/settings/push-discovery-settings.tsx
var Ha = "/api/configuration/push-discovery", Ua = "/api/configuration/push-discovery/secret";
function Wa({ initial: e, receipt: t }) {
	let [n, r] = (0, Z.useState)(e), [i, a] = (0, Z.useState)(e.prefixes), [o, s] = (0, Z.useState)(""), c = Y(), l = n.media_roots, [u, d] = (0, Z.useState)(e), f = (e, n) => {
		r(e), d(e), a(e.prefixes), s(""), t(n);
	}, p = (e, t) => a((n) => n.map((n, r) => r === e ? {
		...n,
		...t
	} : n)), m = (e) => {
		e.preventDefault();
		let t = {
			enabled: n.enabled,
			watch_local: n.watch_local,
			cloud: n.cloud,
			prefixes: i
		};
		c.run("save", (e) => G(Ha, t, "POST", e), (e) => f(e, "已保存配置"), (e) => s(q(e)));
	}, h = () => {
		c.run("secret", (e) => G(Ua, {}, "POST", e), (e) => f(e, "已更换共享密钥"), (e) => s(q(e)));
	}, g = `已入库 ${u.queue.ingested} 个文件` + (u.queue.failed ? `，${u.queue.failed} 个入库失败` : "") + (u.queue.pending ? `，队列里还有 ${u.queue.pending} 条` : ""), _ = u.local_running ? `正在监视 ${u.local_roots.join("、")}` : u.local_message || "没有运行";
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		id: "pushDiscovery",
		guide: "discovery",
		title: "自动发现新文件",
		onSubmit: m,
		children: [
			/* @__PURE__ */ (0, Q.jsx)(V, { children: /* @__PURE__ */ (0, Q.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, Q.jsx)("span", {
					className: "text-body-regular text-text-secondary",
					children: "本机监视"
				}), /* @__PURE__ */ (0, Q.jsx)(H, {
					tone: !u.enabled || !u.watch_local ? "neutral" : u.local_running ? "progress" : "warning",
					children: !u.enabled || !u.watch_local ? "未启用" : u.local_running ? "运行中" : "未运行"
				})]
			}) }),
			/* @__PURE__ */ (0, Q.jsxs)(I, { children: [
				/* @__PURE__ */ (0, Q.jsx)(B, {
					label: "发现新文件后自动入库",
					description: u.enabled ? g : void 0,
					children: /* @__PURE__ */ (0, Q.jsx)(U, {
						"aria-label": "发现新文件后自动入库",
						isSelected: n.enabled,
						isDisabled: !n.available,
						onChange: (e) => r({
							...n,
							enabled: e
						})
					})
				}),
				/* @__PURE__ */ (0, Q.jsx)(B, {
					label: "监视本机文件夹",
					description: u.enabled && u.watch_local ? _ : void 0,
					children: /* @__PURE__ */ (0, Q.jsx)(U, {
						"aria-label": "监视本机文件夹",
						isSelected: n.watch_local,
						isDisabled: !n.available || !n.enabled,
						onChange: (e) => r({
							...n,
							watch_local: e
						})
					})
				}),
				/* @__PURE__ */ (0, Q.jsx)(B, {
					label: "接收 CloudDrive2 通知",
					children: /* @__PURE__ */ (0, Q.jsx)(U, {
						"aria-label": "接收 CloudDrive2 通知",
						isSelected: n.cloud,
						isDisabled: !n.available || !n.enabled,
						onChange: (e) => r({
							...n,
							cloud: e
						})
					})
				}),
				u.enabled && u.cloud ? /* @__PURE__ */ (0, Q.jsx)(B, {
					label: "Webhook 配置",
					description: u.config_toml ? "贴进 CloudDrive2「设置 → Webhooks」，需要会员；更换密钥后要重贴。" : u.origin ? "还没有共享密钥，保存配置后生成。" : "要先有 CloudDrive2 能访问的局域网地址才能生成。"
				}) : null
			] }),
			u.enabled && u.queue.last_error ? /* @__PURE__ */ (0, Q.jsx)(V, {
				divided: !0,
				children: /* @__PURE__ */ (0, Q.jsx)(F, {
					tone: "error",
					title: "最近一次入库失败",
					children: u.queue.last_error
				})
			}) : null,
			u.enabled && u.cloud && u.config_toml ? /* @__PURE__ */ (0, Q.jsx)(V, {
				divided: !0,
				children: /* @__PURE__ */ (0, Q.jsx)("div", {
					className: "flex flex-col gap-3",
					children: /* @__PURE__ */ (0, Q.jsxs)(O, {
						summary: "查看配置",
						children: [/* @__PURE__ */ (0, Q.jsx)(Bn, {
							code: u.config_toml,
							language: "toml",
							label: "CloudDrive2 配置",
							bounded: !1,
							copyLabel: "复制配置",
							onCopy: () => t("已复制 CloudDrive2 配置")
						}), /* @__PURE__ */ (0, Q.jsx)(N, { children: "Windows 桌面版粘贴后显示「无效」时，把这段存成 .toml 文件，放进 %LOCALAPPDATA%\\CloudDrive.WinUI\\webhooks\\ 目录。" })]
					})
				})
			}) : null,
			n.enabled && n.cloud ? /* @__PURE__ */ (0, Q.jsx)(V, {
				divided: !0,
				children: /* @__PURE__ */ (0, Q.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, Q.jsx)(lt, { children: "云端路径前缀" }),
						/* @__PURE__ */ (0, Q.jsx)("div", {
							role: "group",
							"aria-label": "云端路径前缀",
							className: "flex flex-col gap-3",
							children: i.map((e, t) => /* @__PURE__ */ (0, Q.jsxs)("div", {
								className: "flex items-start gap-2",
								children: [
									/* @__PURE__ */ (0, Q.jsx)(P, {
										className: "min-w-0 flex-1",
										"aria-label": `云端路径前缀 ${t + 1}`,
										placeholder: "/115",
										autoComplete: "off",
										maxLength: 200,
										value: e.prefix,
										onChange: (e) => p(t, { prefix: e })
									}),
									/* @__PURE__ */ (0, Q.jsx)(Ft, {
										"aria-label": `前缀 ${t + 1} 对应的媒体根`,
										prefix: "对应目录",
										selectedKey: e.root,
										onSelectionChange: (e) => {
											e !== null && p(t, { root: String(e) });
										},
										children: l.map((e) => /* @__PURE__ */ (0, Q.jsx)(z, {
											id: e,
											children: e
										}, e))
									}),
									/* @__PURE__ */ (0, Q.jsx)(E, {
										variant: "danger",
										iconOnly: !0,
										leadingIcon: gt,
										"aria-label": "移除这一条",
										onClick: () => a((e) => e.filter((e, n) => n !== t))
									})
								]
							}, t))
						}),
						/* @__PURE__ */ (0, Q.jsx)("div", { children: /* @__PURE__ */ (0, Q.jsx)(E, {
							variant: "secondary",
							onClick: () => a((e) => [...e, {
								prefix: "",
								root: l[0] ?? ""
							}]),
							children: "添加前缀"
						}) })
					]
				})
			}) : null,
			o || c.error ? /* @__PURE__ */ (0, Q.jsx)(V, {
				divided: !0,
				children: /* @__PURE__ */ (0, Q.jsx)(k, { children: o || c.error })
			}) : null,
			/* @__PURE__ */ (0, Q.jsxs)(M, { children: [u.enabled && u.cloud && u.config_toml ? /* @__PURE__ */ (0, Q.jsx)(E, {
				variant: "secondary",
				onClick: h,
				disabled: !n.available,
				...K(c.busy === "secret"),
				children: "更换密钥"
			}) : null, /* @__PURE__ */ (0, Q.jsx)(E, {
				type: "submit",
				disabled: !n.available,
				...K(c.busy === "save"),
				children: "保存配置"
			})] })
		]
	});
}
// src/react/settings/media-settings.tsx
async function Ga(e) {
	let t;
	try {
		t = await sn();
	} catch {
		return !0;
	}
	if (!vn(t)) return !0;
	let { confirmed: n } = await Qt({
		title: "扫描与采集正在进行",
		body: Tn(t, e),
		confirmLabel: "仍然保存"
	});
	return n;
}
var Ka = (e) => Wn.find(([t]) => t === e)?.[1] ?? e, qa = [...Wn, ["smb", "SMB 共享"]], Ja = (e) => e.library_icon || Ma(e.transport === "smb" ? "smb" : e.location)[0], Ya = async (e) => (await G(xt, { initial: e })).path, Xa = (e) => ({
	library_id: e.library_id,
	library: e.library,
	library_icon: e.library_icon,
	library_color: e.library_color,
	library_policy: e.library_policy,
	library_stages: e.library_stages
}), Za = (e) => e.library_stages ? Ia.filter((t) => e.library_stages.split(",").includes(t)) : [], Qa = (e = "") => ({
	path: e,
	transport: e.startsWith("smb://") ? "smb" : "filesystem",
	location: "local",
	root: "",
	library_id: xn(),
	library: "",
	library_icon: "",
	library_color: "",
	library_policy: "auto",
	library_stages: "",
	cost: "free"
});
function $a(e) {
	let t = e.media_sources?.filter((e) => Wn.some(([t]) => t === e.location));
	return t?.length ? t.map((e) => ({
		transport: e.transport === "smb" || e.path.startsWith("smb://") ? "smb" : "filesystem",
		smb_username: e.smb_username,
		smb_password: "",
		smb_encrypt: e.smb_encrypt,
		smb_password_saved: e.smb_password_saved,
		path: e.path,
		location: e.location,
		root: e.root,
		library: e.library || "",
		library_icon: e.library_icon || "",
		library_color: e.library_color || "",
		library_policy: e.library_policy || "auto",
		library_stages: e.library_stages || "",
		root_id: e.root_id,
		library_id: e.library_id || xn(),
		cost: e.cost ?? jn(e.location)
	})) : (e.media_dirs.length ? e.media_dirs : [""]).map((e) => Qa(e));
}
var eo = (e) => !(e instanceof qe) || e.status !== 400 ? null : e.body?.errors ?? null;
function to({ data: e, receipt: t, panel: n }) {
	let r = !!e.media_sources?.some((e) => Jn(e.location));
	return (0, Z.useEffect)(() => {
		if (e.editable) {
			let t = /* @__PURE__ */ new Map();
			for (let n of $a(e)) t.set(n.library_id, (t.get(n.library_id) ?? 0) + 1);
			Sn("media", {
				folders: [...t.values()],
				cloud: r
			});
		}
		let t = e.push_discovery;
		t && Sn("discovery", {
			enabled: t.enabled,
			watchLocal: t.watch_local,
			cloud: t.cloud,
			webhook: t.enabled && t.cloud && !!t.config_toml,
			prefixes: t.prefixes.length
		});
	}, [e, r]), /* @__PURE__ */ (0, Q.jsxs)("div", {
		...er(n),
		children: [
			e.editable ? /* @__PURE__ */ (0, Q.jsx)(no, {
				data: e,
				receipt: t
			}) : /* @__PURE__ */ (0, Q.jsx)(F, {
				tone: "neutral",
				title: "只读",
				children: e.notice
			}),
			e.editable ? null : /* @__PURE__ */ (0, Q.jsx)(io, { data: e }),
			r ? /* @__PURE__ */ (0, Q.jsx)(Oa, { receipt: t }) : null,
			e.push_discovery ? /* @__PURE__ */ (0, Q.jsx)(Wa, {
				initial: e.push_discovery,
				receipt: t
			}) : null
		]
	});
}
function no({ data: e, receipt: t }) {
	let { rows: n, edit: r, add: i, remove: a, errors: o, setErrors: s, picking: c, pick: l, inputRef: u } = Xn({
		initial: () => $a(e),
		blank: () => Qa(),
		pickFolder: Ya,
		describe: q
	}), [d, f] = (0, Z.useState)(!1), [p, m] = (0, Z.useState)(!1), [h, g] = (0, Z.useState)(""), [_, v] = (0, Z.useState)({}), [y, b] = (0, Z.useState)(null), x = (0, Z.useRef)(e.revision), S = (0, Z.useRef)(!1), C = Y();
	Nn();
	let w = (e, t) => {
		n.forEach((i, a) => {
			i.library_id === n[e].library_id && r(a, t);
		});
	}, T = [...n.reduce((e, t) => e.has(t.library_id) ? e : e.set(t.library_id, t), /* @__PURE__ */ new Map()).values()], [ee, te] = (0, Z.useState)(null);
	(0, Z.useEffect)(() => {
		if (!ee) return;
		let e = document.querySelector(`[data-library-key="${CSS.escape(ee)}"] [data-library-head] input`);
		e?.scrollIntoView({ block: "center" }), e?.focus(), te(null);
	}, [ee]);
	let ne = (e, t) => {
		let i = n.find((e) => e.library_id === t);
		if (i) {
			r(e, Xa(i));
			return;
		}
		let a = xn();
		r(e, {
			library_id: a,
			library: "",
			library_icon: "",
			library_color: "",
			library_policy: "auto",
			library_stages: ""
		}), te(a);
	};
	(0, Z.useEffect)(() => {
		if (!y) return;
		let e = setTimeout(() => location.assign(y.url), Sa);
		return () => clearTimeout(e);
	}, [y]);
	let re = (e) => {
		e.preventDefault();
		let t = n.findIndex((e) => !e.cost);
		if (t >= 0) {
			m(!0);
			let n = e.currentTarget;
			requestAnimationFrame(() => n.querySelector(`[data-media-read-policy="${t}"] button`)?.focus());
		} else C.busy || S.current || (g(""), S.current = !0, Ga(d).then((e) => {
			S.current = !1, e && ie();
		}));
	}, ie = () => {
		C.run("save", (t) => G(Qe, {
			revision: x.current,
			media_dirs: n.map((e) => e.path),
			...e.media_sources ? { media_sources: n } : {},
			port: String(e.port),
			scan_now: d
		}, "POST", t), (e) => {
			x.current = e.revision, s([]), t("已保存配置"), b(e);
		}, (e) => {
			let t = eo(e);
			s(t?.media_dirs ?? []), (!t || t.port) && g(t?.port || q(e));
		});
	};
	if (y) return /* @__PURE__ */ (0, Q.jsx)(L, {
		guide: "media",
		title: "媒体库与目录",
		children: /* @__PURE__ */ (0, Q.jsx)(V, { children: /* @__PURE__ */ (0, Q.jsxs)(F, {
			tone: "success",
			title: "配置已保存",
			children: [
				"Peach 正在重新启动。稍后自动跳转，或点击",
				/* @__PURE__ */ (0, Q.jsx)(mt, {
					href: y.url,
					size: "small",
					children: "进入馆藏"
				}),
				"。"
			]
		}) })
	});
	let ae = (t) => e.media_sources?.find((e) => e.root_id === t.root_id && e.path === t.path), oe = n.some((e) => Jn(e.location)), se = oe ? (e.mount_dependencies ?? []).filter((e) => !e.available) : [];
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		guide: "media",
		title: "媒体库与目录",
		onSubmit: re,
		children: [/* @__PURE__ */ (0, Q.jsxs)(V, { children: [
			/* @__PURE__ */ (0, Q.jsx)(Ra, {}),
			/* @__PURE__ */ (0, Q.jsx)("div", {
				role: "group",
				"aria-label": "媒体库与目录",
				className: "flex flex-col gap-4",
				children: T.map((e) => {
					let t = n.findIndex((t) => t.library_id === e.library_id), s = n.map((e, t) => ({
						row: e,
						index: t
					})).filter(({ row: t }) => t.library_id === e.library_id), d = e.library_policy, f = e.library || "未命名媒体库";
					return /* @__PURE__ */ (0, Q.jsxs)("div", {
						"data-library-block": "",
						"data-library-key": e.library_id,
						className: Jt({
							variant: "raised",
							padding: "none",
							className: "flex flex-col p-2"
						}),
						"data-library": e.library_color ? e.library_id : void 0,
						children: [
							/* @__PURE__ */ (0, Q.jsxs)("div", {
								"data-library-head": "",
								children: [
									/* @__PURE__ */ (0, Q.jsx)(Pa, {
										label: `${f} 图标`,
										value: e.library_icon,
										kind: e.transport === "smb" ? "smb" : e.location,
										onChange: (e) => w(t, { library_icon: e })
									}),
									/* @__PURE__ */ (0, Q.jsx)(P, {
										className: "w-full",
										"aria-label": `${f} 名称`,
										maxLength: 80,
										placeholder: "媒体库名称",
										value: e.library,
										onChange: (e) => w(t, { library: e })
									}),
									/* @__PURE__ */ (0, Q.jsx)(Va, {
										id: e.library_id,
										name: e.library,
										value: e.library_color,
										onChange: (e) => w(t, { library_color: e })
									}),
									/* @__PURE__ */ (0, Q.jsx)(za, {
										name: f,
										value: d,
										onChange: (n) => w(t, {
											library_policy: n,
											library_stages: n === "custom" ? e.library_stages || Ia.join(",") : ""
										})
									})
								]
							}),
							d === "custom" ? /* @__PURE__ */ (0, Q.jsx)(Ba, {
								name: f,
								value: Za(e),
								onChange: (e) => w(t, { library_stages: Ia.filter((t) => e.includes(t)).join(",") })
							}) : null,
							/* @__PURE__ */ (0, Q.jsxs)("div", {
								"data-library-folders": "",
								role: "group",
								"aria-label": `${f} 的文件夹`,
								children: [s.map(({ row: t, index: i }) => /* @__PURE__ */ (0, Q.jsxs)(Un, {
									label: `媒体目录 ${i + 1}`,
									path: t.path,
									onPath: (e) => r(i, {
										path: e,
										transport: e.startsWith("smb://") ? "smb" : t.transport
									}),
									error: o[i],
									inputRef: u(i),
									picking: c === i,
									onPick: () => void l(i),
									onRemove: n.length > 1 ? () => a(i) : void 0,
									status: ae(t) ? /* @__PURE__ */ (0, Q.jsx)(ro, { online: ae(t)?.online }) : null,
									children: [/* @__PURE__ */ (0, Q.jsxs)(Hn, { children: [
										/* @__PURE__ */ (0, Q.jsx)(qn, {
											index: i,
											value: t.transport === "smb" ? "smb" : t.location,
											options: qa,
											onChange: (e) => {
												let n = e === "smb";
												r(i, {
													transport: n ? "smb" : "filesystem",
													location: n ? "local" : e,
													cost: n || e === "local" ? "free" : "",
													path: n ? t.path.startsWith("smb://") ? t.path : "smb://" : t.path.startsWith("smb://") ? "" : t.path
												}), v((e) => {
													let t = { ...e };
													return delete t[i], t;
												});
											}
										}),
										/* @__PURE__ */ (0, Q.jsx)(Gn, {
											index: i,
											cost: t.cost,
											onChange: (e) => r(i, { cost: e }),
											error: p && !t.cost ? "请选择媒体读取策略" : void 0
										}),
										t.root_id && !ae(t) ? /* @__PURE__ */ (0, Q.jsx)(Vn, {
											label: "变更方式",
											className: "w-full @lg:w-auto @lg:flex-1",
											children: /* @__PURE__ */ (0, Q.jsxs)(R, {
												className: "w-full",
												"aria-label": `目录变更方式 ${i + 1}`,
												placeholder: "选择目录变更方式",
												selectedKey: t.change_mode || null,
												onSelectionChange: (e) => {
													e === "add" ? r(i, {
														root_id: void 0,
														root: "",
														change_mode: ""
													}) : r(i, { change_mode: "relocate" });
												},
												children: [/* @__PURE__ */ (0, Q.jsx)(z, {
													id: "relocate",
													children: "重定位此目录，保留文件记录"
												}), /* @__PURE__ */ (0, Q.jsx)(z, {
													id: "add",
													children: "添加另一目录"
												})]
											})
										}) : null,
										T.length > 1 ? /* @__PURE__ */ (0, Q.jsx)(Vn, {
											label: "移到媒体库",
											className: "w-full @lg:w-48",
											children: /* @__PURE__ */ (0, Q.jsxs)(R, {
												className: "w-full",
												"aria-label": `目录所属媒体库 ${i + 1}`,
												selectedKey: t.library_id,
												renderValue: /* @__PURE__ */ (0, Q.jsxs)("span", {
													className: "flex min-w-0 items-center gap-2",
													children: [/* @__PURE__ */ (0, Q.jsx)(zt, { mark: Ja(e) }), /* @__PURE__ */ (0, Q.jsx)("span", {
														className: "truncate",
														children: f
													})]
												}),
												onSelectionChange: (e) => {
													e && ne(i, String(e));
												},
												children: [T.map((e) => /* @__PURE__ */ (0, Q.jsx)(z, {
													id: e.library_id,
													textValue: e.library || "未命名媒体库",
													children: /* @__PURE__ */ (0, Q.jsxs)("span", {
														className: "flex min-w-0 items-center gap-2",
														children: [/* @__PURE__ */ (0, Q.jsx)(zt, { mark: Ja(e) }), /* @__PURE__ */ (0, Q.jsx)("span", {
															className: "truncate",
															children: e.library || "未命名媒体库"
														})]
													})
												}, e.library_id)), s.length > 1 ? /* @__PURE__ */ (0, Q.jsx)(z, {
													id: "new",
													textValue: "新建媒体库",
													children: /* @__PURE__ */ (0, Q.jsxs)("span", {
														className: "flex min-w-0 items-center gap-2",
														children: [/* @__PURE__ */ (0, Q.jsx)(zt, { mark: "plus" }), /* @__PURE__ */ (0, Q.jsx)("span", { children: "新建媒体库" })]
													})
												}) : null]
											})
										}) : null
									] }), t.transport === "smb" ? /* @__PURE__ */ (0, Q.jsxs)("div", {
										className: "flex w-full flex-col gap-2",
										children: [
											/* @__PURE__ */ (0, Q.jsxs)(Hn, { children: [/* @__PURE__ */ (0, Q.jsx)(Vn, {
												label: "SMB 账号",
												className: "w-full @lg:flex-1",
												children: /* @__PURE__ */ (0, Q.jsx)(P, {
													"aria-label": `SMB 账号 ${i + 1}`,
													value: t.smb_username || "",
													autoComplete: "off",
													onChange: (e) => r(i, { smb_username: e })
												})
											}), /* @__PURE__ */ (0, Q.jsx)(Vn, {
												label: "SMB 密码",
												className: "w-full @lg:flex-1",
												children: /* @__PURE__ */ (0, Q.jsx)(P, {
													"aria-label": `SMB 密码 ${i + 1}`,
													type: "password",
													value: t.smb_password || "",
													autoComplete: "new-password",
													placeholder: t.smb_password_saved ? "留空保留已保存密码" : "",
													onChange: (e) => r(i, { smb_password: e })
												})
											})] }),
											/* @__PURE__ */ (0, Q.jsx)(D, {
												isSelected: t.smb_encrypt || !1,
												onChange: (e) => r(i, { smb_encrypt: e }),
												children: "要求 SMB 加密"
											}),
											/* @__PURE__ */ (0, Q.jsx)(D, {
												isSelected: t.smb_clear || !1,
												onChange: (e) => r(i, { smb_clear: e }),
												children: "移除已保存的 SMB 账号"
											}),
											/* @__PURE__ */ (0, Q.jsx)(E, {
												className: "self-start",
												variant: "secondary",
												...K(C.busy === `smb-${i}`),
												onClick: () => void C.run(`smb-${i}`, (e) => G("/api/configuration/smb/test", t, "POST", e), (e) => v((t) => ({
													...t,
													[i]: {
														message: "共享目录可读取",
														directories: e.directories
													}
												})), (e) => v((t) => ({
													...t,
													[i]: {
														message: q(e),
														directories: []
													}
												}))),
												children: "测试连接"
											}),
											_[i] ? /* @__PURE__ */ (0, Q.jsx)(N, { children: _[i].message }) : null,
											_[i]?.directories.length ? /* @__PURE__ */ (0, Q.jsx)(R, {
												"aria-label": `SMB 子目录 ${i + 1}`,
												placeholder: "进入子目录",
												selectedKey: null,
												onSelectionChange: (e) => {
													e && (r(i, { path: t.path.replace(/\/$/, "") + "/" + encodeURIComponent(String(e)) }), v((e) => ({
														...e,
														[i]: {
															message: "请测试此子目录",
															directories: []
														}
													})));
												},
												children: _[i].directories.map((e) => /* @__PURE__ */ (0, Q.jsx)(z, {
													id: e,
													children: e
												}, e))
											}) : null,
											/* @__PURE__ */ (0, Q.jsx)(N, { children: "地址填写 smb://服务器/共享/目录。按共享账号权限读写；整理和删除由对应操作触发，资料和预览保存在 Peach 数据目录。" })
										]
									}) : null]
								}, i)), /* @__PURE__ */ (0, Q.jsx)("div", {
									className: "flex",
									children: /* @__PURE__ */ (0, Q.jsx)(E, {
										variant: "secondary",
										"aria-label": `给 ${f} 添加文件夹`,
										onClick: () => {
											i(), r(n.length, {
												...Xa(e),
												location: e.location,
												cost: e.cost
											});
										},
										children: "添加文件夹"
									})
								})]
							})
						]
					}, e.library_id);
				})
			}),
			/* @__PURE__ */ (0, Q.jsx)(E, {
				variant: "secondary",
				className: "self-start",
				onClick: i,
				children: "添加媒体库"
			}),
			/* @__PURE__ */ (0, Q.jsx)(N, { children: dt }),
			oe ? /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)(Kn, {}), /* @__PURE__ */ (0, Q.jsx)(Ta, {})] }) : null,
			se.map((e) => /* @__PURE__ */ (0, Q.jsxs)(N, { children: [
				"未检测到 ",
				e.name,
				"。",
				/* @__PURE__ */ (0, Q.jsxs)(A, {
					href: e.download_url,
					children: ["下载 ", e.name]
				})
			] }, e.name)),
			/* @__PURE__ */ (0, Q.jsx)(D, {
				isSelected: d,
				onChange: f,
				children: "保存后扫描并补全资料"
			}),
			h ? /* @__PURE__ */ (0, Q.jsx)(F, {
				tone: "error",
				title: "没有保存",
				children: h
			}) : null
		] }), /* @__PURE__ */ (0, Q.jsx)(M, {
			status: "保存后 Peach 会重新启动。",
			children: /* @__PURE__ */ (0, Q.jsx)(E, {
				type: "submit",
				...K(C.busy === "save"),
				children: "保存配置"
			})
		})]
	});
}
function ro({ online: e }) {
	return /* @__PURE__ */ (0, Q.jsx)(Zn, { online: e });
}
function io({ data: e }) {
	let t = e.media_sources, n = Y();
	return t ? /* @__PURE__ */ (0, Q.jsxs)(L, {
		guide: "mounts",
		title: "挂载状态",
		children: [
			/* @__PURE__ */ (0, Q.jsx)(ct, { children: t.map((e, t) => /* @__PURE__ */ (0, Q.jsxs)(j, {
				term: /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)(zt, { mark: Yn(e.location) }), Ka(e.location)] }),
				children: [e.path || "未配置挂载点", /* @__PURE__ */ (0, Q.jsx)(ro, { online: e.online })]
			}, t)) }),
			n.error ? /* @__PURE__ */ (0, Q.jsx)(V, {
				divided: !0,
				children: /* @__PURE__ */ (0, Q.jsx)(k, { children: n.error })
			}) : null,
			/* @__PURE__ */ (0, Q.jsx)(M, { children: /* @__PURE__ */ (0, Q.jsx)(E, {
				variant: "secondary",
				onClick: () => void n.run("refresh", (e) => nn(e), (e) => bn.setQueryData(Ze, e)),
				...K(n.busy === "refresh"),
				children: "刷新挂载状态"
			}) })
		]
	}) : null;
}
// src/react/settings/service-preferences.tsx
var ao = [
	["off", "关闭"],
	["precise", "每 10 秒一张"],
	["coarse", "每 30 秒一张"]
];
function oo({ epoch: e = 0, disabled: t = !1 }) {
	let n = X({
		queryKey: Bt,
		queryFn: ({ signal: e }) => un(e),
		refetchOnMount: "always"
	}), r = zn(), i = r.reset;
	(0, Z.useEffect)(() => {
		i();
	}, [e, i]);
	let a = n.data, o = r.error || n.error;
	return /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [
		/* @__PURE__ */ (0, Q.jsx)(I, { children: /* @__PURE__ */ (0, Q.jsx)(B, {
			label: "时间轴预览",
			description: "按所选间隔抽帧，仅处理本机磁盘上的视频。",
			children: /* @__PURE__ */ (0, Q.jsx)("div", {
				id: "videoThumbnailSetting",
				children: /* @__PURE__ */ (0, Q.jsx)(R, {
					"aria-label": "缩略图采集间隔",
					selectedKey: a?.mode || "off",
					isDisabled: t || !a || n.isFetching || r.isPending,
					onSelectionChange: (e) => {
						e !== null && r.mutate(String(e));
					},
					children: ao.map(([e, t]) => /* @__PURE__ */ (0, Q.jsx)(z, {
						id: e,
						children: t
					}, e))
				})
			})
		}) }),
		r.isPending || a?.status === "running" ? /* @__PURE__ */ (0, Q.jsxs)(V, {
			divided: !0,
			children: [/* @__PURE__ */ (0, Q.jsx)(N, {
				role: "status",
				children: r.isPending ? "正在保存…" : "正在采集。"
			}), r.isPending ? null : /* @__PURE__ */ (0, Q.jsx)(Vt, {})]
		}) : null,
		o ? /* @__PURE__ */ (0, Q.jsx)(V, {
			divided: !0,
			children: /* @__PURE__ */ (0, Q.jsx)(k, { children: q(o) })
		}) : null
	] });
}
function so({ receipt: e }) {
	let t = Kt();
	(0, Z.useSyncExternalStore)(t.subscribe, t.version);
	let n = X({
		queryKey: jt,
		queryFn: ({ signal: e }) => ln(e),
		refetchOnMount: "always"
	}), r = Rn(), i = n.data?.followInitialDays ?? t.value.followInitialDays, a = r.error || n.error;
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		guide: "follow-options",
		title: "关注采集",
		children: [/* @__PURE__ */ (0, Q.jsxs)(I, { children: [
			/* @__PURE__ */ (0, Q.jsx)(co, {}),
			/* @__PURE__ */ (0, Q.jsx)(lo, {}),
			/* @__PURE__ */ (0, Q.jsx)(B, {
				label: "首次采集范围",
				children: /* @__PURE__ */ (0, Q.jsx)("div", {
					id: "followInitialDaysSetting",
					children: /* @__PURE__ */ (0, Q.jsx)(R, {
						"aria-label": "首次采集范围",
						selectedKey: String(i),
						isDisabled: n.isFetching || r.isPending,
						onSelectionChange: (n) => {
							n !== null && r.mutate({ followInitialDays: Number(n) }, { onSuccess: (n) => {
								typeof n.followInitialDays == "number" && (t.value.followInitialDays = n.followInitialDays), t.save(), e("已保存首次采集范围");
							} });
						},
						children: ot.map(([e, t]) => /* @__PURE__ */ (0, Q.jsx)(z, {
							id: e,
							children: t
						}, e))
					})
				})
			}),
			/* @__PURE__ */ (0, Q.jsx)(B, {
				label: "头像刷新",
				children: "每 3 个月"
			}),
			/* @__PURE__ */ (0, Q.jsx)(B, {
				label: "favicon 刷新",
				children: "每年"
			})
		] }), a ? /* @__PURE__ */ (0, Q.jsx)(V, {
			divided: !0,
			children: /* @__PURE__ */ (0, Q.jsx)(k, { children: q(a) })
		}) : null]
	});
}
function co() {
	let e = X({
		queryKey: st,
		queryFn: ({ signal: e }) => on(e),
		refetchOnMount: "always",
		refetchInterval: (e) => Dn(e.state.data)
	}), t = Ln(), n = e.data, r = (0, Z.useRef)(qt(Number(localStorage.getItem("peach.number.followScheduleSetting")), 15, 10080, 60)), [i, a] = (0, Z.useState)("60"), [o, s] = (0, Z.useState)(!1);
	(0, Z.useEffect)(() => {
		n?.enabled && (r.current = n.interval_minutes, a(String(n.interval_minutes)));
	}, [n]);
	let c = !n?.available || e.isFetching || t.isPending, l = () => {
		let e = Number(i);
		!Number.isInteger(e) || e < 15 || e > 10080 ? s(!0) : (s(!1), n?.enabled && !c && e !== n.interval_minutes && (r.current = e, localStorage.setItem("peach.number.followScheduleSetting", String(e)), t.mutate(e)));
	}, u = t.error || e.error;
	return /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [
		/* @__PURE__ */ (0, Q.jsx)(B, {
			label: "自动检查更新",
			children: /* @__PURE__ */ (0, Q.jsxs)("div", {
				id: "followScheduleSetting",
				className: "flex min-h-9 min-w-0 flex-wrap items-center justify-end gap-2",
				children: [/* @__PURE__ */ (0, Q.jsx)(U, {
					"aria-label": "自动检查更新",
					isSelected: n?.enabled === !0,
					isDisabled: c,
					onChange: (e) => {
						localStorage.setItem("peach.number.followScheduleSetting", String(r.current)), t.mutate(e ? r.current : 0);
					}
				}), n?.enabled ? /* @__PURE__ */ (0, Q.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, Q.jsx)(P, {
						type: "number",
						inputMode: "numeric",
						name: "follow-interval",
						autoComplete: "off",
						"aria-label": "自动检查间隔",
						className: "w-24",
						value: i,
						onChange: (e) => {
							a(e), s(!1);
						},
						onBlur: l,
						onKeyDown: (e) => {
							e.key === "Enter" && (e.preventDefault(), l());
						},
						isDisabled: c,
						isInvalid: o
					}), /* @__PURE__ */ (0, Q.jsx)("span", {
						className: "text-body-2-regular text-text-secondary",
						children: "分钟"
					})]
				}) : null]
			})
		}),
		o ? /* @__PURE__ */ (0, Q.jsx)(V, { children: /* @__PURE__ */ (0, Q.jsx)(k, { children: "请输入 15–10080 的整数（分钟）。" }) }) : null,
		t.isPending || n?.running ? /* @__PURE__ */ (0, Q.jsx)(V, { children: /* @__PURE__ */ (0, Q.jsx)(N, {
			role: "status",
			children: t.isPending ? "正在保存…" : "正在检查来源更新…"
		}) }) : null,
		/* @__PURE__ */ (0, Q.jsx)(uo, {
			kind: "follow",
			status: n,
			title: "上次自动检查失败"
		}),
		u ? /* @__PURE__ */ (0, Q.jsx)(V, { children: /* @__PURE__ */ (0, Q.jsx)(k, { children: q(u) }) }) : null
	] });
}
function lo() {
	let e = X({
		queryKey: it,
		queryFn: ({ signal: e }) => an(e),
		refetchOnMount: "always",
		refetchInterval: (e) => Dn(e.state.data)
	}), t = e.data;
	if (!t) return e.isPending ? /* @__PURE__ */ (0, Q.jsx)(B, {
		label: "订阅源拉取",
		children: /* @__PURE__ */ (0, Q.jsx)("span", {
			"data-skeleton": !0,
			"aria-busy": "true",
			"aria-label": "正在读取订阅源拉取间隔",
			className: "block h-4 w-16 rounded-2lg bg-background-tertiary-default"
		})
	}) : null;
	let n = t.interval_minutes, r = n % 60 ? `每 ${n} 分钟` : `每 ${n / 60} 小时`;
	return /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [
		/* @__PURE__ */ (0, Q.jsx)(B, {
			label: "订阅源拉取",
			children: /* @__PURE__ */ (0, Q.jsx)("span", {
				id: "feedScheduleSetting",
				children: t.available ? t.enabled ? r : "已关闭" : "只在写入端可用"
			})
		}),
		t.running ? /* @__PURE__ */ (0, Q.jsx)(V, { children: /* @__PURE__ */ (0, Q.jsx)(N, {
			role: "status",
			children: "正在拉取订阅源…"
		}) }) : null,
		/* @__PURE__ */ (0, Q.jsx)(uo, {
			kind: "feed",
			status: t,
			title: "上次自动拉取失败"
		})
	] });
}
function uo({ kind: e, status: t, title: n }) {
	let r = In(e);
	if (!t?.enabled || t.running || !t.last_error) return null;
	let i = t.consecutive_failures ?? 0, a = pn(t.next_run_at), o = [i > 1 ? `已连续失败 ${i} 次` : "", a ? `下一轮 ${a}` : ""].filter(Boolean).join("，"), s = [
		t.last_error,
		o,
		r.error ? `没有重试：${q(r.error)}` : ""
	].filter(Boolean).join("\n");
	return /* @__PURE__ */ (0, Q.jsx)(V, { children: /* @__PURE__ */ (0, Q.jsx)(F, {
		tone: "error",
		title: n,
		action: /* @__PURE__ */ (0, Q.jsx)(E, {
			variant: "secondary",
			size: "small",
			disabled: !t.available,
			...K(r.isPending),
			onClick: () => r.mutate(),
			children: "立即重试"
		}),
		children: s
	}) });
}
// src/react/settings/media-processing-settings.tsx
function fo({ receipt: e }) {
	let t = X({
		queryKey: _t,
		queryFn: ({ signal: e }) => cn(e)
	}), n = Y(), r = n.error || (t.error ? q(t.error) : ""), i = !t.data || t.isFetching || !!n.busy;
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		guide: "preview",
		title: "视频预览",
		children: [
			/* @__PURE__ */ (0, Q.jsx)(I, { children: /* @__PURE__ */ (0, Q.jsx)(B, {
				label: "生成视频预览",
				description: "为本地视频生成九宫格与时间轴预览；关闭后仍按入库规则探测时长与分辨率。",
				children: /* @__PURE__ */ (0, Q.jsx)(U, {
					"aria-label": "生成视频预览",
					isSelected: !!t.data && !t.data.metadata_only,
					isDisabled: i,
					onChange: (t) => void n.run("save", (e) => G(vt, { metadata_only: !t }, "POST", e), (t) => {
						bn.setQueryData(_t, t), bn.invalidateQueries({ queryKey: Bt }), bn.invalidateQueries({ queryKey: ft }), e(t.metadata_only ? "已关闭视频预览生成" : "已开启视频预览生成");
					})
				})
			}) }),
			/* @__PURE__ */ (0, Q.jsx)(oo, { disabled: !t.data || t.data.metadata_only || !!n.busy }),
			/* @__PURE__ */ (0, Q.jsx)(I, { children: /* @__PURE__ */ (0, Q.jsx)(B, {
				label: "抽帧解码方式",
				description: "用于生成封面、九宫格和时间轴。",
				children: /* @__PURE__ */ (0, Q.jsx)("div", {
					id: "previewAccelerationSetting",
					children: /* @__PURE__ */ (0, Q.jsxs)(R, {
						"aria-label": "抽帧解码方式",
						selectedKey: t.data?.preview_acceleration || "auto",
						isDisabled: i,
						onSelectionChange: (t) => {
							t !== null && n.run("preview_acceleration", (e) => G(vt, { preview_acceleration: String(t) }, "POST", e), (t) => {
								bn.setQueryData(_t, t), e("已保存抽帧解码方式");
							});
						},
						children: [/* @__PURE__ */ (0, Q.jsx)(z, {
							id: "auto",
							children: "自动（硬件优先）"
						}), /* @__PURE__ */ (0, Q.jsx)(z, {
							id: "software",
							children: "软件解码"
						})]
					})
				})
			}) }),
			n.busy ? /* @__PURE__ */ (0, Q.jsx)(V, {
				divided: !0,
				children: /* @__PURE__ */ (0, Q.jsx)(N, {
					role: "status",
					children: "正在保存…"
				})
			}) : null,
			r ? /* @__PURE__ */ (0, Q.jsx)(V, {
				divided: !0,
				children: /* @__PURE__ */ (0, Q.jsx)(k, { children: r })
			}) : null
		]
	});
}
function po({ receipt: e }) {
	let t = X({
		queryKey: _t,
		queryFn: ({ signal: e }) => cn(e)
	}), n = Y(), r = n.error || (t.error ? q(t.error) : "");
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		guide: "transcode",
		title: "视频播放",
		children: [
			/* @__PURE__ */ (0, Q.jsx)(I, { children: /* @__PURE__ */ (0, Q.jsx)(B, {
				label: "转码方式",
				description: "用于播放时的视频转码。",
				children: /* @__PURE__ */ (0, Q.jsx)("div", {
					id: "playbackAccelerationSetting",
					children: /* @__PURE__ */ (0, Q.jsxs)(R, {
						"aria-label": "转码方式",
						selectedKey: t.data?.playback_acceleration || "auto",
						isDisabled: !t.data || t.isFetching || !!n.busy,
						onSelectionChange: (t) => {
							t !== null && n.run("playback_acceleration", (e) => G(vt, { playback_acceleration: String(t) }, "POST", e), (t) => {
								bn.setQueryData(_t, t), e("已保存转码方式");
							});
						},
						children: [/* @__PURE__ */ (0, Q.jsx)(z, {
							id: "auto",
							children: "自动（硬件优先）"
						}), /* @__PURE__ */ (0, Q.jsx)(z, {
							id: "software",
							children: "软件编解码"
						})]
					})
				})
			}) }),
			n.busy ? /* @__PURE__ */ (0, Q.jsx)(V, {
				divided: !0,
				children: /* @__PURE__ */ (0, Q.jsx)(N, {
					role: "status",
					children: "正在保存…"
				})
			}) : null,
			r ? /* @__PURE__ */ (0, Q.jsx)(V, {
				divided: !0,
				children: /* @__PURE__ */ (0, Q.jsx)(k, { children: r })
			}) : null
		]
	});
}
// src/react/boardui/components/base/textarea/textarea.tsx
var mo = An({
	field: "relative flex w-full flex-col rounded-2lg bg-background-tertiary-default text-foreground-icon-tertiary ring-2 ring-inset ring-transparent transition-[background-color,box-shadow,color] duration-[var(--input-transition-ms)] ease",
	fieldSize: {
		medium: "p-2",
		small: "px-1.5 py-2"
	},
	textarea: "block w-full min-w-0 bg-transparent border-0 outline-none m-0 p-0 px-1 font-sans text-body-regular text-text-primary placeholder:text-text-tertiary focus:placeholder:text-text-primary disabled:text-input-disabled-text disabled:placeholder:text-input-disabled-text disabled:cursor-not-allowed aria-invalid:placeholder:text-text-error-placeholder",
	resize: {
		none: "resize-none",
		vertical: "resize-y"
	},
	footer: "flex w-full items-start justify-between gap-3",
	count: "ms-auto shrink-0 pt-px text-caption-1-medium text-text-tertiary tabular-nums"
}), ho = 20;
function go({ size: e, rows: t = 3, autoResize: n = !1, maxRows: r, resize: i = "vertical", fieldClassName: a, className: o, ref: s, groupRef: c, onInput: l, ...u }) {
	let d = (0, Z.useContext)(Ut), f = e ?? d.size ?? "medium", p = (0, Z.useRef)(null), m = (e) => {
		p.current = e, typeof s == "function" ? s(e) : s && (s.current = e);
	}, h = () => {
		let e = p.current;
		if (!e) return;
		if (!n) {
			e.style.height = "", e.style.maxHeight = "", e.style.overflowY = "";
			return;
		}
		let i = parseFloat(window.getComputedStyle(e).lineHeight) || ho, a = r ? r * i : Infinity;
		e.style.height = "0px";
		let o = Math.max(e.scrollHeight, t * i);
		e.style.height = `${Math.min(o, a)}px`, e.style.maxHeight = r ? `${a}px` : "", e.style.overflowY = o > a ? "auto" : "hidden";
	};
	return (0, Z.useLayoutEffect)(h), /* @__PURE__ */ (0, Q.jsx)(Re, {
		ref: c,
		className: ({ isFocusWithin: e, isHovered: t, isDisabled: n, isInvalid: r }) => tn(mo.field, mo.fieldSize[f], t && !e && !n && !r && "ring-border-button-hover", e && !n && !r && "ring-border-button-active", n && "bg-input-disabled-background text-input-disabled-foreground", r && "bg-background-tertiary-error text-foreground-icon-error", d.fieldClassName, a),
		children: /* @__PURE__ */ (0, Q.jsx)(Ve, {
			ref: m,
			rows: t,
			...u,
			onInput: (e) => {
				h(), l?.(e);
			},
			className: tn(mo.textarea, mo.resize[n ? "none" : i], d.inputClassName, o)
		})
	});
}
go.displayName = "TextareaBase";
function _o({ label: e, hint: t, tooltip: n, placeholder: r, rows: i, autoResize: a, maxRows: o, resize: s, maxLength: c, showCount: l = !1, fieldClassName: u, ref: d, groupRef: f, className: p, value: m, defaultValue: h, onChange: g, ..._ }) {
	let [v, y] = (0, Z.useState)(() => (h ?? "").length), b = m === void 0 ? v : m.length;
	return /* @__PURE__ */ (0, Q.jsx)(Ht, {
		..._,
		value: m,
		defaultValue: h,
		onChange: (e) => {
			l && m === void 0 && y(e.length), g?.(e);
		},
		className: p,
		"aria-label": _["aria-label"] ?? (!e && typeof r == "string" ? r : void 0),
		children: ({ isRequired: p, isInvalid: m }) => /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [
			e && /* @__PURE__ */ (0, Q.jsx)(pt, {
				isRequired: p,
				isInvalid: m,
				tooltip: n,
				children: e
			}),
			/* @__PURE__ */ (0, Q.jsx)(go, {
				ref: d,
				groupRef: f,
				placeholder: r,
				rows: i,
				autoResize: a,
				maxRows: o,
				resize: s,
				maxLength: c,
				fieldClassName: u
			}),
			(t || l) && /* @__PURE__ */ (0, Q.jsxs)("div", {
				className: mo.footer,
				children: [t && /* @__PURE__ */ (0, Q.jsx)(ut, {
					isInvalid: m,
					children: t
				}), l && /* @__PURE__ */ (0, Q.jsx)("span", {
					className: tn(mo.count, m && "text-text-error-primary"),
					children: c ? `${b}/${c}` : b
				})]
			})
		] })
	});
}
_o.displayName = "Textarea";
// src/react/settings/code-pattern-settings.tsx
var vo = "^\\+{3}\\s*(?<code>FC2-PPV-\\d+)\n\\[(?<code>[A-Z]+-\\d+)\\]";
function yo({ receipt: e }) {
	let t = X({
		queryKey: jt,
		queryFn: ({ signal: e }) => ln(e)
	}), [n, r] = (0, Z.useState)(null), i = Y(), a = n ?? (t.data?.codePatterns ?? []).join("\n"), o = i.error || (t.error ? q(t.error) : "");
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		guide: "codes",
		title: "番号识别规则",
		onSubmit: (t) => {
			t.preventDefault();
			let n = a.split("\n").map((e) => e.trim()).filter(Boolean);
			i.run("save", (e) => G(Mt, { codePatterns: n }, "POST", e), (t) => {
				bn.setQueryData(jt, t), r(null), e("已保存配置");
			});
		},
		children: [/* @__PURE__ */ (0, Q.jsxs)(V, { children: [/* @__PURE__ */ (0, Q.jsx)(N, { children: "内置规则认不出番号时，按这里的规则从文件名里取。每行一条正则表达式，番号写在 (?<code>…) 里，没有命名组就取第一个括号。规则在下一次处理时对还没有番号的视频生效。" }), /* @__PURE__ */ (0, Q.jsx)(_o, {
			id: "codePatternSetting",
			"aria-label": "番号识别规则",
			rows: 3,
			autoResize: !0,
			maxRows: 12,
			spellCheck: "false",
			autoComplete: "off",
			placeholder: vo,
			value: a,
			isDisabled: !t.data,
			isInvalid: !!o,
			hint: o || void 0,
			onChange: r
		})] }), /* @__PURE__ */ (0, Q.jsx)(M, { children: /* @__PURE__ */ (0, Q.jsx)(E, {
			type: "submit",
			...K(i.busy === "save"),
			children: "保存配置"
		}) })]
	});
}
// src/react/settings/password-pair.tsx
function bo({ label: e, password: t, confirmation: n, onPassword: r, onConfirmation: i, disabled: a = !1, passwordError: o, passwordHint: s, confirmationError: c, confirmationInvalid: l = !1 }) {
	return /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)(P, {
		id: "access-password",
		type: "password",
		label: e,
		autoComplete: "new-password",
		maxLength: 256,
		value: t,
		onChange: r,
		isDisabled: a,
		isRequired: !a,
		validationBehavior: "aria",
		isInvalid: !a && !!o,
		hint: a ? s : o || s
	}), /* @__PURE__ */ (0, Q.jsx)(P, {
		id: "access-confirm",
		type: "password",
		label: "确认访问密码",
		autoComplete: "new-password",
		maxLength: 256,
		value: n,
		onChange: i,
		isDisabled: a,
		isRequired: !a,
		validationBehavior: "aria",
		isInvalid: !a && (!!c || l),
		hint: a ? void 0 : c
	})] });
}
// src/react/settings/access-settings.tsx
var xo = {
	legacy: "当前使用系统生成的访问口令。改设自己的密码，或关闭登录要求。",
	locked: "访问设置无法读取，请在本机检查配置文件。",
	password: "已设置密码。新设备需要登录，登录时勾选「保持登录」可保持 30 天。"
};
function So({ initial: e, receipt: t }) {
	let [n, r] = (0, Z.useState)(e), [i, a] = (0, Z.useState)(""), [o, s] = (0, Z.useState)(""), [c, l] = (0, Z.useState)(""), [u, d] = (0, Z.useState)(!1), [f, p] = (0, Z.useState)({}), m = (0, Z.useRef)(null), h = Y(), g = (e) => {
		e.preventDefault();
		let f = {};
		n.mode === "password" && !i && (f.current_password = "请输入当前访问密码"), u || ((o.length < 8 || o.length > 256) && (f.password = "访问密码需为 8–256 个字符"), o !== c && (f.confirmation = "两次输入的密码不一致")), p(f), Object.keys(f).length ? requestAnimationFrame(() => m.current?.querySelector("input[aria-invalid=\"true\"]")?.focus()) : h.run("save", (e) => G("/api/configuration/access", {
			revision: n.revision,
			action: u ? "disable" : "set",
			confirm_disable: u,
			current_password: i,
			password: u ? "" : o,
			confirmation: u ? "" : c
		}, "POST", e), (e) => {
			r(e), a(""), s(""), l(""), d(!1), p({}), t(e.mode === "open" ? "已关闭访问密码" : "已保存配置");
		}, (e) => {
			let t = e instanceof qe ? e.body : null, n = t?.errors || t?.detail?.errors;
			n ? p(n) : h.setError(q(e));
		});
	}, _ = xo[n.mode], v = n.mode !== "locked";
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		guide: "access",
		title: "访问密码",
		onSubmit: g,
		children: [/* @__PURE__ */ (0, Q.jsx)("div", {
			ref: m,
			children: /* @__PURE__ */ (0, Q.jsxs)(V, { children: [
				_ ? /* @__PURE__ */ (0, Q.jsx)(N, { children: _ }) : null,
				n.mode === "open" ? /* @__PURE__ */ (0, Q.jsx)(F, {
					tone: "warning",
					title: "未设置访问密码",
					children: "能连接到 Peach 的设备打开地址就能看馆藏，不需要登录。"
				}) : null,
				n.mode === "password" || n.mode === "legacy" ? /* @__PURE__ */ (0, Q.jsx)(D, {
					isSelected: u,
					onChange: d,
					children: "关闭访问密码"
				}) : null,
				n.mode === "password" ? /* @__PURE__ */ (0, Q.jsx)(P, {
					id: "access-current",
					type: "password",
					label: "当前访问密码",
					autoComplete: "current-password",
					maxLength: 256,
					value: i,
					onChange: a,
					isRequired: !0,
					validationBehavior: "aria",
					isInvalid: !!f.current_password,
					hint: f.current_password
				}) : null,
				v && !u ? /* @__PURE__ */ (0, Q.jsx)(bo, {
					label: n.mode === "password" ? "新访问密码" : "设置访问密码",
					password: o,
					confirmation: c,
					onPassword: s,
					onConfirmation: l,
					passwordError: f.password,
					confirmationError: f.confirmation,
					passwordHint: "至少 8 个字符。保存后其他设备需要重新登录。"
				}) : null,
				u ? /* @__PURE__ */ (0, Q.jsx)(F, {
					tone: "warning",
					title: "访问范围",
					children: "保存后，能连接到 Peach 的设备将直接访问馆藏。"
				}) : null,
				h.error ? /* @__PURE__ */ (0, Q.jsx)(k, { children: h.error }) : null
			] })
		}), v ? /* @__PURE__ */ (0, Q.jsx)(M, { children: /* @__PURE__ */ (0, Q.jsx)(E, {
			type: "submit",
			...K(h.busy === "save"),
			children: "保存配置"
		}) }) : null]
	});
}
// src/react/components/configuration-fields.tsx
function Co({ id: e, label: t, value: n, onChange: r, options: i, isDisabled: a, isInvalid: o, children: s }) {
	let c = `${e}-label`;
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		className: "flex flex-col gap-1.5",
		children: [
			/* @__PURE__ */ (0, Q.jsx)(pt, {
				id: c,
				elementType: "span",
				children: t
			}),
			/* @__PURE__ */ (0, Q.jsx)(Pt, {
				id: e,
				"aria-labelledby": c,
				orientation: "horizontal",
				className: At,
				value: n,
				onChange: r,
				isDisabled: a,
				isInvalid: o,
				children: i.map((e) => /* @__PURE__ */ (0, Q.jsx)(Ge, {
					value: e.value,
					className: kt,
					children: e.label
				}, e.value))
			}),
			s
		]
	});
}
function wo({ prefix: e, suffix: t, ...n }) {
	let r = () => /* @__PURE__ */ (0, Q.jsx)("span", {
		className: "shrink-0 pr-1 text-body-regular text-text-secondary",
		children: t
	});
	return /* @__PURE__ */ (0, Q.jsx)(P, {
		...n,
		leadingAddon: e ? /* @__PURE__ */ (0, Q.jsx)("span", {
			className: "shrink-0 pl-1 text-body-regular text-text-secondary",
			children: e
		}) : void 0,
		trailingIcon: t ? r : void 0
	});
}
// src/react/settings/port-settings.tsx
var To = [{
	value: "0.0.0.0",
	label: "同一局域网的设备"
}, {
	value: "127.0.0.1",
	label: "只有这台电脑"
}];
function Eo({ data: e, receipt: t }) {
	let n = e.network, r = n ? n.editable : e.editable && e.port_editable !== !1, [i, a] = (0, Z.useState)(n?.host ?? "127.0.0.1"), [o, s] = (0, Z.useState)(n?.mdns_name ?? "peach"), [c, l] = (0, Z.useState)(String(e.port)), [u, d] = (0, Z.useState)({}), [f, p] = (0, Z.useState)(null), m = Y();
	return (0, Z.useEffect)(() => {
		if (!f) return;
		let e = setTimeout(() => location.assign(f.url), Sa);
		return () => clearTimeout(e);
	}, [f]), f ? /* @__PURE__ */ (0, Q.jsx)(L, {
		guide: "port",
		title: "访问地址",
		children: /* @__PURE__ */ (0, Q.jsx)(V, { children: /* @__PURE__ */ (0, Q.jsxs)(F, {
			tone: "success",
			title: "配置已保存",
			children: ["Peach 正在重新启动。", /* @__PURE__ */ (0, Q.jsx)(mt, {
				href: f.url,
				size: "small",
				children: "返回网络与访问"
			})]
		}) })
	}) : /* @__PURE__ */ (0, Q.jsxs)(L, {
		guide: "port",
		title: "访问地址",
		onSubmit: r ? (r) => {
			r.preventDefault(), d({}), m.run("save", (t) => G(Qe, {
				revision: e.revision,
				media_dirs: e.media_dirs,
				...e.media_sources ? { media_sources: e.media_sources } : {},
				port: c,
				scan_now: !1,
				...n?.editable ? {
					host: i,
					...i === "0.0.0.0" ? { mdns_name: o } : {}
				} : {}
			}, "POST", t), (e) => {
				p({ url: new URL("/settings/network", e.url).href }), t("已保存配置");
			}, (e) => {
				let t = e instanceof qe && e.status === 400 ? e.body?.errors : null;
				t && (t.port || t.host || t.mdns_name) ? d(t) : m.setError(q(e));
			});
		} : void 0,
		children: [/* @__PURE__ */ (0, Q.jsxs)(V, { children: [
			n ? /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)(Do, {
				label: "本机地址",
				value: n.local_url,
				receipt: t
			}), n.lan_url || n.ip_url ? /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [
				/* @__PURE__ */ (0, Q.jsx)(Do, {
					label: "手机连接地址",
					value: n.lan_url || n.ip_url,
					receipt: t
				}),
				n.lan_url && n.ip_url ? /* @__PURE__ */ (0, Q.jsx)(Do, {
					label: "备用 IP 地址",
					value: n.ip_url,
					receipt: t
				}) : null,
				/* @__PURE__ */ (0, Q.jsxs)(N, { children: ["手机与电脑连接同一 Wi-Fi。", n.ip_url && n.lan_url ? "名称地址打不开时，可尝试备用 IP 地址。" : ""] })
			] }) : /* @__PURE__ */ (0, Q.jsx)(N, { children: n.scope === "local" ? "当前只允许这台电脑访问，手机无法连接。" : "局域网连接地址未取得，请检查电脑的网络连接和服务启动配置。" })] }) : null,
			r ? /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [n?.editable ? /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)(Co, {
				id: "configHost",
				label: "谁可以访问",
				value: i,
				onChange: a,
				options: To,
				isDisabled: !!m.busy,
				isInvalid: !!u.host,
				children: u.host ? /* @__PURE__ */ (0, Q.jsx)(k, { children: u.host }) : null
			}), i === "0.0.0.0" ? /* @__PURE__ */ (0, Q.jsx)(wo, {
				id: "configMdnsName",
				label: "局域网访问地址",
				value: o,
				onChange: s,
				prefix: n.local_url.startsWith("https:") ? "https://" : "http://",
				suffix: ".local",
				autoComplete: "off",
				spellCheck: "false",
				maxLength: 63,
				isDisabled: !!m.busy,
				validationBehavior: "aria",
				isInvalid: !!u.mdns_name,
				hint: u.mdns_name || void 0
			}) : null] }) : null, /* @__PURE__ */ (0, Q.jsx)(wo, {
				id: "configPort",
				label: "端口",
				prefix: "localhost:",
				inputMode: "numeric",
				value: c,
				onChange: l,
				isDisabled: !!m.busy,
				validationBehavior: "aria",
				isInvalid: !!u.port,
				hint: u.port
			})] }) : /* @__PURE__ */ (0, Q.jsx)(N, { children: e.notice || "访问范围、名称与端口由服务启动配置管理。" }),
			n?.editable && i === "0.0.0.0" && n.scope === "local" ? /* @__PURE__ */ (0, Q.jsx)(N, { children: "保存并重启后显示手机连接地址。可在下方设置访问密码。" }) : null,
			m.error ? /* @__PURE__ */ (0, Q.jsx)(F, {
				tone: "error",
				title: "没有保存",
				children: m.error
			}) : null
		] }), r ? /* @__PURE__ */ (0, Q.jsx)(M, {
			status: "保存后 Peach 会重启，并跳转到新地址。",
			children: /* @__PURE__ */ (0, Q.jsx)(E, {
				type: "submit",
				...K(m.busy === "save"),
				children: "保存配置"
			})
		}) : null]
	});
}
function Do({ label: e, value: t, receipt: n }) {
	let r = Y();
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-2",
		children: [/* @__PURE__ */ (0, Q.jsxs)("div", {
			className: "flex min-w-0 flex-wrap items-end gap-2",
			children: [/* @__PURE__ */ (0, Q.jsx)(P, {
				className: "min-w-0 flex-1",
				label: e,
				value: t,
				isReadOnly: !0,
				autoComplete: "off"
			}), /* @__PURE__ */ (0, Q.jsx)(E, {
				variant: "secondary",
				"aria-label": `复制${e}`,
				onClick: () => void r.run("copy", () => navigator.clipboard.writeText(t), () => n("已复制地址")),
				children: "复制地址"
			})]
		}), r.error ? /* @__PURE__ */ (0, Q.jsx)(N, {
			role: "status",
			children: "复制失败，请选中地址复制。"
		}) : null]
	});
}
// src/react/settings/peach-proxy-fields.tsx
var Oo = [
	["environment", "跟随环境"],
	["direct", "直连"],
	["proxy", "自定义"]
];
function ko({ mode: e, onChange: t, labelledBy: n }) {
	return /* @__PURE__ */ (0, Q.jsx)(R, {
		"aria-label": n ? void 0 : "连接方式",
		"aria-labelledby": n,
		selectedKey: e,
		onSelectionChange: (e) => {
			e !== null && t(String(e));
		},
		children: Oo.map(([e, t]) => /* @__PURE__ */ (0, Q.jsx)(z, {
			id: e,
			children: t
		}, e))
	});
}
function Ao({ id: e, value: t, onChange: n, saved: r = !1, error: i }) {
	return /* @__PURE__ */ (0, Q.jsx)(P, {
		id: e,
		type: "password",
		label: "代理地址",
		autoComplete: "off",
		spellCheck: "false",
		value: t,
		onChange: n,
		placeholder: r ? "已保存，留空保留" : "http://127.0.0.1:7890",
		validationBehavior: "aria",
		isInvalid: !!i,
		hint: i
	});
}
// src/react/settings/tunnel-settings.tsx
var jo = 2e3, Mo = [["quick", "临时链接"], ["named", "命名隧道"]], No = {
	quick: "临时预览用，地址随机，重启后会变。启动前要先设置访问密码。",
	named: "使用你在 Cloudflare 绑定的固定域名。启动前要先设置访问密码。"
};
function Po({ revision: e, initial: t, receipt: n }) {
	let [r, i] = (0, Z.useState)(t), [a, o] = (0, Z.useState)(e), [s, c] = (0, Z.useState)(t.mode), [l, u] = (0, Z.useState)(t.hostname), [d, f] = (0, Z.useState)(""), [p, m] = (0, Z.useState)({}), h = Y(), g = r.state === "starting" || r.state === "running", _ = r.named_available && s === "named";
	(0, Z.useEffect)(() => {
		if (r.state !== "starting") return;
		let e = new AbortController(), t = window.setInterval(() => {
			nn(e.signal).then((t) => {
				!e.signal.aborted && t.tunnel && (bn.setQueryData(Ze, t), i(t.tunnel), o(t.revision));
			}).catch(() => void 0);
		}, jo);
		return () => {
			e.abort(), window.clearInterval(t);
		};
	}, [r.state]);
	let v = (e, t, n) => {
		m({}), h.run(e, (e) => G("/api/configuration/tunnel", {
			revision: a,
			enabled: t,
			mode: s,
			hostname: l,
			token: d
		}, "POST", e), (e) => {
			i(e), o(e.revision), c(e.mode), u(e.hostname), f(""), n(e);
		}, (e) => {
			let t = e instanceof qe ? e.body : null, n = t?.errors || t?.detail?.errors;
			n ? m(n) : h.setError(q(e));
		});
	};
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		id: "tunnel",
		guide: "tunnel",
		title: "Cloudflare 公网入口",
		onSubmit: (e) => {
			e.preventDefault(), v("save", g, () => n("已保存配置"));
		},
		aside: /* @__PURE__ */ (0, Q.jsx)(H, {
			tone: r.error ? "error" : g ? "progress" : "neutral",
			children: r.error ? "连接失败" : r.state === "running" ? "运行中" : r.state === "starting" ? "连接中" : "已停止"
		}),
		children: [/* @__PURE__ */ (0, Q.jsxs)(V, { children: [
			r.named_available ? /* @__PURE__ */ (0, Q.jsx)(Pt, {
				"aria-label": "公网入口的形态（二选一）",
				value: s,
				isDisabled: g,
				onChange: (e) => c(e),
				className: At,
				children: Mo.map(([e, t]) => /* @__PURE__ */ (0, Q.jsx)(Ge, {
					value: e,
					className: kt,
					children: t
				}, e))
			}) : null,
			/* @__PURE__ */ (0, Q.jsx)(N, { children: No[_ ? "named" : "quick"] }),
			_ ? /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)(P, {
				id: "tunnel-hostname",
				label: "公开主机名",
				autoComplete: "off",
				maxLength: 253,
				value: l,
				onChange: u,
				isDisabled: g,
				validationBehavior: "aria",
				isInvalid: !!p.hostname,
				hint: p.hostname || "Cloudflare Zero Trust 里指向这台电脑的主机名。"
			}), /* @__PURE__ */ (0, Q.jsx)(P, {
				id: "tunnel-token",
				type: "password",
				label: "隧道令牌",
				autoComplete: "off",
				maxLength: 2048,
				value: d,
				onChange: f,
				isDisabled: g,
				validationBehavior: "aria",
				hint: r.token_set ? "已保存，留空不改。" : "在 Cloudflare Zero Trust 的隧道详情页复制。"
			})] }) : null,
			r.available ? null : /* @__PURE__ */ (0, Q.jsx)(F, {
				tone: "warning",
				title: "找不到 cloudflared",
				children: "安装官方 cloudflared，或用设置文件的 tunnel.binary 与 PEACH_CLOUDFLARED 指定路径。"
			}),
			r.state === "running" && r.url ? /* @__PURE__ */ (0, Q.jsx)(F, {
				tone: "info",
				title: "公网地址",
				children: /* @__PURE__ */ (0, Q.jsx)(A, {
					href: r.url,
					children: r.url
				})
			}) : null,
			r.state === "starting" ? /* @__PURE__ */ (0, Q.jsx)(F, {
				tone: "info",
				title: "正在连接",
				children: "正在等待 cloudflared 连上 Cloudflare 边缘。"
			}) : null,
			r.error ? /* @__PURE__ */ (0, Q.jsx)(k, { children: r.error }) : null,
			h.error ? /* @__PURE__ */ (0, Q.jsx)(k, { children: h.error }) : null
		] }), /* @__PURE__ */ (0, Q.jsxs)(M, {
			status: r.enabled ? "Peach 重启后自动恢复。" : void 0,
			children: [/* @__PURE__ */ (0, Q.jsx)(E, {
				variant: r.named_available ? "secondary" : "primary",
				onClick: () => v("toggle", !g, (e) => n(e.enabled ? "公网入口已启动" : "公网入口已停止")),
				...K(h.busy === "toggle"),
				children: g ? "停止公网入口" : "启动公网入口"
			}), r.named_available ? /* @__PURE__ */ (0, Q.jsx)(E, {
				type: "submit",
				...K(h.busy === "save"),
				children: "保存配置"
			}) : null]
		})]
	});
}
// src/react/settings/network-settings.tsx
function Fo({ data: e, receipt: t, panel: n, issues: r }) {
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		...er(n),
		children: [
			r,
			e.network || e.editable && e.port_editable !== !1 && !e.section_errors?.media_sources ? /* @__PURE__ */ (0, Q.jsx)(Eo, {
				data: e,
				receipt: t
			}) : null,
			e.access ? /* @__PURE__ */ (0, Q.jsx)(So, {
				initial: e.access,
				receipt: t
			}) : null,
			e.tunnel ? /* @__PURE__ */ (0, Q.jsx)(Po, {
				revision: e.revision,
				initial: e.tunnel,
				receipt: t
			}) : null,
			e.peach_proxy ? /* @__PURE__ */ (0, Q.jsx)(Io, {
				initial: e.peach_proxy,
				receipt: t
			}) : null
		]
	});
}
function Io({ initial: e, receipt: t }) {
	let [n, r] = (0, Z.useState)(e), [i, a] = (0, Z.useState)(e.mode), [o, s] = (0, Z.useState)(""), c = Y();
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		id: "peachProxy",
		guide: "proxy",
		title: "Peach 代理",
		onSubmit: (e) => {
			e.preventDefault(), c.run("save", (e) => G("/api/configuration/peach-proxy", {
				mode: i,
				proxy: o
			}, "POST", e), (e) => {
				r(e), s(""), t("已保存配置");
			});
		},
		children: [
			/* @__PURE__ */ (0, Q.jsx)(I, { children: /* @__PURE__ */ (0, Q.jsx)(B, {
				label: "连接方式",
				children: /* @__PURE__ */ (0, Q.jsx)(ko, {
					mode: i,
					onChange: a
				})
			}) }),
			i === "proxy" || n.needs_selection || c.error ? /* @__PURE__ */ (0, Q.jsxs)(V, {
				divided: !0,
				children: [
					i === "proxy" ? /* @__PURE__ */ (0, Q.jsx)(Ao, {
						id: "peachProxyAddress",
						value: o,
						onChange: s,
						saved: n.proxy_saved
					}) : null,
					n.needs_selection ? /* @__PURE__ */ (0, Q.jsx)(F, {
						tone: "warning",
						title: "需要选择连接方式",
						children: "已有来源的代理地址不同，请选择公共连接方式。"
					}) : null,
					c.error ? /* @__PURE__ */ (0, Q.jsx)(k, { children: c.error }) : null
				]
			}) : null,
			/* @__PURE__ */ (0, Q.jsx)(M, { children: /* @__PURE__ */ (0, Q.jsx)(E, {
				type: "submit",
				...K(c.busy === "save"),
				children: "保存配置"
			}) })
		]
	});
}
// src/react/follow-manage/credentials.tsx
var Lo = "将清除这个来源在本机和共享副本中的登录凭据。", Ro = "其他系统用户可以读取此凭据文件。请在运行 Peach 的 Mac 或 Linux 电脑上，将文件权限设为仅当前用户可读写（0600）。";
function zo(e, t) {
	return (e.shared_fields || []).includes(t) ? "来自共享，留空表示不改" : e.fields.includes(t) ? "已保存，留空表示不改" : "未填写";
}
function Bo({ row: e }) {
	if ($t(e)) return /* @__PURE__ */ (0, Q.jsx)(et, {
		variant: "caption",
		color: "lime",
		children: "已配置"
	});
	let t = e.requirement === "required" ? "yellow" : e.requirement === "blocked" ? "rose" : "neutral";
	return /* @__PURE__ */ (0, Q.jsx)(et, {
		variant: "caption",
		color: t,
		children: $e[e.requirement] || ""
	});
}
function Vo({ row: e, readOnly: t, toast: n }) {
	let [r, i] = (0, Z.useState)({}), [a, o] = (0, Z.useState)(""), s = $t(e), c = Pn({
		mutationFn: (t) => En(e.provider, t),
		onSuccess: (e, t) => {
			e.note ? o(e.note) : (o(""), i({}), bn.invalidateQueries({
				queryKey: at,
				exact: !0
			}), n(Object.keys(t).length ? "已保存来源凭据" : "已清除来源凭据"));
		},
		onError: (e) => o(q(e))
	}), l = () => {
		let e = Object.fromEntries(Object.entries(r).map(([e, t]) => [e, t.trim()]).filter(([, e]) => e));
		Object.keys(e).length ? c.mutate(e) : o("没有填写内容");
	};
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, Q.jsxs)(N, { children: [e.why, e.where ? /* @__PURE__ */ (0, Q.jsxs)(Q.Fragment, { children: [" ", /* @__PURE__ */ (0, Q.jsx)(A, {
				href: e.where,
				children: "获取凭据"
			})] }) : null] }),
			e.howto ? /* @__PURE__ */ (0, Q.jsx)(N, { children: e.howto }) : null,
			/* @__PURE__ */ (0, Q.jsx)("div", {
				className: "flex w-full flex-col gap-3",
				children: (e.needs || []).map((n) => /* @__PURE__ */ (0, Q.jsx)(P, {
					type: "password",
					label: n,
					placeholder: zo(e, n),
					autoComplete: "off",
					spellCheck: "false",
					isDisabled: t,
					value: r[n] || "",
					onChange: (e) => i({
						...r,
						[n]: e
					}),
					className: "w-full min-w-0"
				}, n))
			}),
			/* @__PURE__ */ (0, Q.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [s ? /* @__PURE__ */ (0, Q.jsx)(E, {
					variant: "danger",
					disabled: t,
					...K(c.isPending),
					onClick: () => void Qt({
						title: "清除来源凭据",
						body: Lo,
						confirmLabel: "清除来源凭据",
						danger: !0,
						onConfirm: () => c.mutateAsync({})
					}),
					children: "清除"
				}) : null, /* @__PURE__ */ (0, Q.jsx)(E, {
					variant: "primary",
					disabled: t,
					...K(c.isPending),
					onClick: l,
					children: "保存配置"
				})]
			}),
			a ? /* @__PURE__ */ (0, Q.jsx)(k, { children: a }) : null,
			(e.shared_fields || []).length ? /* @__PURE__ */ (0, Q.jsx)(N, { children: `${e.shared_fields.join("、")} 使用共享副本中的登录信息，本机没有单独保存。清除时，本机和共享副本中的登录信息都会删除。` }) : null,
			e.path ? /* @__PURE__ */ (0, Q.jsx)(O, {
				summary: "凭据文件",
				children: /* @__PURE__ */ (0, Q.jsx)(Et, {
					path: e.path,
					className: "font-mono text-caption-1-regular text-text-tertiary",
					onRevealed: n
				})
			}) : null
		]
	});
}
function Ho({ row: e, readOnly: t, toast: n }) {
	let r = /* @__PURE__ */ (0, Q.jsxs)("span", {
		className: "flex min-w-0 flex-wrap items-center gap-2",
		children: [
			/* @__PURE__ */ (0, Q.jsx)("span", {
				className: "inline-flex size-3.5 shrink-0 items-center justify-center",
				children: /* @__PURE__ */ (0, Q.jsx)(Qn, { provider: e.provider })
			}),
			/* @__PURE__ */ (0, Q.jsx)("b", {
				className: "min-w-0 text-body-medium wrap-anywhere text-text-primary",
				children: e.provider_label
			}),
			/* @__PURE__ */ (0, Q.jsx)(Bo, { row: e }),
			e.missing.map((e) => /* @__PURE__ */ (0, Q.jsx)(et, {
				variant: "caption",
				color: "rose",
				children: `缺 ${e}`
			}, e))
		]
	});
	return e.requirement === "none" || e.requirement === "blocked" ? /* @__PURE__ */ (0, Q.jsxs)("div", {
		className: "flex flex-wrap items-center gap-3 border-b border-separator-border px-6 py-5 last:border-b-0 max-sm:px-4",
		children: [r, e.requirement === "blocked" ? /* @__PURE__ */ (0, Q.jsx)(N, { children: e.why }) : null]
	}) : /* @__PURE__ */ (0, Q.jsxs)("div", {
		className: "flex flex-col gap-2 border-b border-separator-border px-6 py-5 last:border-b-0 max-sm:px-4",
		children: [
			r,
			/* @__PURE__ */ (0, Q.jsx)(O, {
				summary: $t(e) ? "修改凭据" : "填写凭据",
				defaultOpen: e.requirement === "required" && !$t(e),
				children: /* @__PURE__ */ (0, Q.jsx)(Vo, {
					row: e,
					readOnly: t,
					toast: n
				})
			}),
			e.world_readable ? /* @__PURE__ */ (0, Q.jsx)(F, {
				tone: "error",
				title: "凭据文件权限过宽",
				children: Ro
			}) : null
		]
	});
}
function Uo({ data: e, readOnly: t, toast: n, embedded: r = !1 }) {
	let i = e.providers || [], a = i.filter((e) => e.requirement === "required" && !$t(e));
	if ((0, Z.useEffect)(() => {
		Sn("credentials", { done: i.filter($t).map((e) => e.provider) });
	}, [e]), !i.length) return /* @__PURE__ */ (0, Q.jsx)(rt, {
		size: "compact",
		icon: Zt,
		title: "没有可配置的来源",
		children: "已接入的站点及其凭据状态会显示在这里。"
	});
	let o = a.length ? /* @__PURE__ */ (0, Q.jsx)("span", {
		className: "text-body-2-regular text-text-error-primary",
		children: `${a.length} 个待配置`
	}) : null, s = /* @__PURE__ */ (0, Q.jsx)(Q.Fragment, { children: [
		{
			title: "可配置凭据",
			rows: i.filter((e) => e.requirement !== "none" && e.requirement !== "blocked")
		},
		{
			title: "不需要凭据",
			rows: i.filter((e) => e.requirement === "none")
		},
		{
			title: "暂不支持",
			rows: i.filter((e) => e.requirement === "blocked")
		}
	].filter((e) => e.rows.length).map((e) => /* @__PURE__ */ (0, Q.jsxs)("section", {
		"aria-label": e.title,
		className: "flex flex-col gap-2",
		children: [/* @__PURE__ */ (0, Q.jsx)("h4", {
			className: "text-body-medium text-text-secondary",
			children: e.title
		}), /* @__PURE__ */ (0, Q.jsx)("div", {
			className: Jt({
				variant: "outlined",
				padding: "none",
				className: "flex flex-col overflow-hidden"
			}),
			children: e.rows.map((e) => /* @__PURE__ */ (0, Q.jsx)(Ho, {
				row: e,
				readOnly: t,
				toast: n
			}, e.provider))
		})]
	}, e.title)) });
	return r ? /* @__PURE__ */ (0, Q.jsx)(L, {
		guide: "credentials",
		title: "来源凭据",
		aside: o || void 0,
		children: /* @__PURE__ */ (0, Q.jsx)(V, { children: /* @__PURE__ */ (0, Q.jsx)("div", {
			className: "flex flex-col gap-4",
			children: s
		}) })
	}) : /* @__PURE__ */ (0, Q.jsxs)("div", {
		className: Jt({
			padding: "none",
			className: "flex flex-col gap-4 px-6 py-5 max-sm:px-4"
		}),
		children: [/* @__PURE__ */ (0, Q.jsxs)("div", {
			className: "flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ (0, Q.jsx)("h3", {
				className: "mr-auto text-title-2-medium text-text-primary",
				children: "来源凭据"
			}), o]
		}), s]
	});
}
// src/react/settings/entry-links-settings.tsx
function Wo({ initial: e, receipt: t }) {
	let [n, r] = (0, Z.useState)(e.sites), i = Y(), a = (e, t) => r((n) => n.map((n) => n.key === e ? {
		...n,
		host: t
	} : n));
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		guide: "entry-links",
		title: "作品资料站点",
		onSubmit: (e) => {
			e.preventDefault();
			let a = { sites: Object.fromEntries(n.map((e) => [e.key, { host: e.host }])) };
			i.run("save", (e) => G("/api/configuration/entry-links", a, "POST", e), (e) => {
				r(e.sites), t("已保存配置");
			});
		},
		children: [/* @__PURE__ */ (0, Q.jsxs)(V, { children: [
			/* @__PURE__ */ (0, Q.jsx)(N, { children: tt }),
			n.map((e) => /* @__PURE__ */ (0, Q.jsx)(P, {
				id: `entry-link-${e.key}`,
				label: /* @__PURE__ */ (0, Q.jsx)(Lt, {
					site: e.key,
					label: `${e.label} 地址`
				}),
				autoComplete: "off",
				maxLength: 100,
				value: e.host,
				placeholder: e.default_host,
				onChange: (t) => a(e.key, t),
				validationBehavior: "aria",
				hint: nt
			}, e.key)),
			i.error ? /* @__PURE__ */ (0, Q.jsx)(k, { children: i.error }) : null
		] }), /* @__PURE__ */ (0, Q.jsx)(M, { children: /* @__PURE__ */ (0, Q.jsx)(E, {
			type: "submit",
			...K(i.busy === "save"),
			children: "保存配置"
		}) })]
	});
}
// src/react/settings/indexer-settings.tsx
var Go = "/api/configuration/indexers";
function Ko({ receipt: e }) {
	let t = X({
		queryKey: ["indexers"],
		queryFn: ({ signal: e }) => W(Go, e),
		refetchOnMount: "always"
	});
	return t.error ? /* @__PURE__ */ (0, Q.jsx)(k, { children: q(t.error) }) : t.isFetching ? /* @__PURE__ */ (0, Q.jsx)(Nt, {
		label: "正在读取资源搜索设置",
		html: dn
	}) : t.data ? /* @__PURE__ */ (0, Q.jsx)(Yo, {
		initial: t.data,
		receipt: e
	}) : null;
}
function qo(e) {
	try {
		return new globalThis.URL(e).host;
	} catch {
		return e;
	}
}
function Jo({ row: e, index: t }) {
	let n = [
		e.url ? qo(e.url) : "未填地址",
		e.enabled ? "已启用" : "已停用",
		e.api_key_set && !e.clear_api_key ? "已保存 API key" : e.api_key ? "API key 待保存" : "没有 API key"
	];
	return /* @__PURE__ */ (0, Q.jsxs)("span", {
		className: "flex min-w-0 items-baseline gap-3",
		children: [/* @__PURE__ */ (0, Q.jsx)("span", {
			className: "shrink-0 text-text-primary",
			children: e.name || `索引器 ${t + 1}`
		}), /* @__PURE__ */ (0, Q.jsx)("span", {
			className: "truncate text-body-2-regular text-text-secondary",
			children: n.join(" · ")
		})]
	});
}
function Yo({ initial: e, receipt: t }) {
	let [n, r] = (0, Z.useState)(e.indexers), i = Y();
	(0, Z.useEffect)(() => {
		Sn("indexers", { open: e.indexers.map((e) => !e.url) });
	}, [e]);
	let a = (e, t) => r((n) => n.map((n) => n.key === e ? {
		...n,
		...t
	} : n));
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		guide: "indexers",
		title: "资源搜索",
		onSubmit: (e) => {
			e.preventDefault(), i.run("save", (e) => G(Go, { indexers: n }, "POST", e), (e) => {
				r(e.indexers), t("已保存索引器");
			});
		},
		children: [/* @__PURE__ */ (0, Q.jsxs)(V, { children: [/* @__PURE__ */ (0, Q.jsxs)("div", {
			className: "flex min-w-0 flex-col gap-4",
			children: [/* @__PURE__ */ (0, Q.jsx)(O, {
				summary: "索引器连接帮助",
				children: /* @__PURE__ */ (0, Q.jsxs)(N, { children: [
					"填写 Prowlarr 或 Jackett 提供的 Torznab 地址和 API key。",
					" ",
					/* @__PURE__ */ (0, Q.jsx)(A, {
						href: "https://github.com/peach-mitao/peach/blob/master/docs/RESOURCE_SEARCH.md",
						children: "详细配置说明"
					})
				] })
			}), n.map((e, t) => /* @__PURE__ */ (0, Q.jsx)("div", {
				className: "min-w-0 border-t border-separator-border pt-2",
				children: /* @__PURE__ */ (0, Q.jsx)(O, {
					defaultOpen: !e.url,
					summary: /* @__PURE__ */ (0, Q.jsx)(Jo, {
						row: e,
						index: t
					}),
					children: /* @__PURE__ */ (0, Q.jsxs)("div", {
						className: "flex min-w-0 flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, Q.jsx)(P, {
								label: "名称",
								"aria-label": `索引器 ${t + 1} 名称`,
								value: e.name,
								maxLength: 80,
								isDisabled: !!i.busy,
								onChange: (t) => a(e.key, { name: t })
							}),
							/* @__PURE__ */ (0, Q.jsx)(P, {
								label: "Torznab 地址",
								"aria-label": `索引器 ${t + 1} Torznab 地址`,
								value: e.url,
								type: "url",
								autoComplete: "off",
								placeholder: "索引器提供的 API 地址",
								isDisabled: !!i.busy,
								onChange: (t) => a(e.key, { url: t })
							}),
							/* @__PURE__ */ (0, Q.jsx)(P, {
								label: "API key",
								"aria-label": `索引器 ${t + 1} API key`,
								type: "password",
								autoComplete: "new-password",
								value: e.api_key || "",
								placeholder: e.api_key_set ? "已保存，留空不改" : void 0,
								isDisabled: !!i.busy,
								onChange: (t) => a(e.key, { api_key: t })
							}),
							/* @__PURE__ */ (0, Q.jsxs)("div", {
								className: "flex flex-wrap items-center gap-x-6 gap-y-2",
								children: [
									/* @__PURE__ */ (0, Q.jsx)(D, {
										isSelected: e.enabled,
										isDisabled: !!i.busy,
										onChange: (t) => a(e.key, { enabled: t }),
										children: "启用"
									}),
									e.api_key_set ? /* @__PURE__ */ (0, Q.jsx)(D, {
										isSelected: !!e.clear_api_key,
										isDisabled: !!i.busy,
										onChange: (t) => a(e.key, { clear_api_key: t }),
										children: "清除已保存的 API key"
									}) : null,
									/* @__PURE__ */ (0, Q.jsx)(E, {
										variant: "danger",
										type: "button",
										size: "small",
										disabled: !!i.busy,
										"aria-label": `移除索引器 ${t + 1}`,
										onClick: () => r(n.filter((t) => t.key !== e.key)),
										children: "移除"
									})
								]
							})
						]
					})
				})
			}, e.key))]
		}), i.error ? /* @__PURE__ */ (0, Q.jsx)(k, { children: i.error }) : null] }), /* @__PURE__ */ (0, Q.jsxs)(M, { children: [/* @__PURE__ */ (0, Q.jsx)(E, {
			variant: "secondary",
			type: "button",
			disabled: !!i.busy || n.length >= e.max_indexers,
			onClick: () => r([...n, {
				key: xn(),
				name: "",
				url: "",
				enabled: !0,
				api_key_set: !1
			}]),
			children: "添加索引器"
		}), /* @__PURE__ */ (0, Q.jsx)(E, {
			type: "submit",
			...K(i.busy === "save"),
			children: "保存配置"
		})] })]
	});
}
// src/react/settings/source-settings.tsx
function Xo({ data: e, receipt: t, panel: n, issues: r }) {
	let i = X({
		queryKey: at,
		queryFn: ({ signal: e }) => rn(e),
		enabled: n?.active !== !1,
		refetchOnMount: "always"
	});
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		...er(n),
		children: [
			r,
			/* @__PURE__ */ (0, Q.jsx)("div", {
				"data-guide-target": "sources",
				children: /* @__PURE__ */ (0, Q.jsx)(Je, {
					href: "/sources",
					variant: "secondary",
					children: "采集来源与登录状态"
				})
			}),
			i.data ? /* @__PURE__ */ (0, Q.jsx)(Uo, {
				data: i.data,
				readOnly: !!e.ledger_read_only,
				toast: t,
				embedded: !0
			}) : i.error ? /* @__PURE__ */ (0, Q.jsx)(F, {
				tone: "error",
				title: "来源凭据未取得",
				children: q(i.error)
			}) : n?.active === !1 ? null : /* @__PURE__ */ (0, Q.jsx)(Nt, {
				label: "正在读取来源凭据",
				html: en
			}),
			/* @__PURE__ */ (0, Q.jsx)(so, { receipt: t }),
			/* @__PURE__ */ (0, Q.jsx)(Ko, { receipt: t }),
			e.entry_links ? /* @__PURE__ */ (0, Q.jsx)(Wo, {
				initial: e.entry_links,
				receipt: t
			}) : null
		]
	});
}
// src/react/settings/subtitle-generation-settings.tsx
var Zo = ["subtitles", "generation"], Qo = "/api/subtitles/generation", $o = (e) => W(Qo, e);
function es({ item: e }) {
	return /* @__PURE__ */ (0, Q.jsx)("a", {
		className: "min-w-0 flex-1 wrap-anywhere text-body-medium text-text-primary",
		href: `/assets/${e.id}`,
		children: e.name
	});
}
function ts({ active: e, receipt: t }) {
	let n = X({
		queryKey: Zo,
		queryFn: ({ signal: e }) => $o(e),
		enabled: e,
		refetchInterval: e ? 4e3 : !1
	}), r = Y(), i = n.data;
	(0, Z.useEffect)(() => {
		e && window.location.hash === "#subtitleGeneration" && document.getElementById("subtitleGeneration")?.scrollIntoView({ block: "start" });
	}, [e, i]);
	let a = (e, n) => {
		bn.setQueryData(Zo, e), t(n);
	}, o = (e, t, n, i) => {
		r.run(e, (e) => G(t, n, "POST", e), (e) => a(e, i));
	}, s = i?.counts;
	return /* @__PURE__ */ (0, Q.jsxs)(L, {
		id: "subtitleGeneration",
		title: "中文字幕",
		children: [/* @__PURE__ */ (0, Q.jsx)(I, { children: /* @__PURE__ */ (0, Q.jsx)(B, {
			label: "自动生成",
			description: "缺中文字幕的日语影片排队转写并翻译。关闭后当前这一部做完就停。安装版使用 config.toml 的 asr_python，不自带显卡运行库。",
			children: /* @__PURE__ */ (0, Q.jsx)(U, {
				"aria-label": "自动生成中文字幕",
				isSelected: !!i?.enabled,
				isDisabled: !i || !!r.busy,
				onChange: (e) => o("enabled", Qo, { enabled: e }, e ? "已打开中文字幕生成" : "已关闭中文字幕生成")
			})
		}) }), /* @__PURE__ */ (0, Q.jsxs)(V, {
			divided: !0,
			children: [
				n.isError ? /* @__PURE__ */ (0, Q.jsx)(k, { children: q(n.error) }) : null,
				r.error ? /* @__PURE__ */ (0, Q.jsx)(k, { children: r.error }) : null,
				i?.notice ? /* @__PURE__ */ (0, Q.jsx)(N, {
					role: "status",
					children: i.notice
				}) : null,
				i?.unavailable ? /* @__PURE__ */ (0, Q.jsx)(N, {
					role: "status",
					children: i.unavailable
				}) : null,
				s ? /* @__PURE__ */ (0, Q.jsxs)(N, {
					role: "status",
					children: [
						"排队 ",
						s.queued,
						" · 生成中 ",
						s.running,
						" · 失败 ",
						s.failed,
						" · 已完成 ",
						s.ready,
						" · 已忽略 ",
						s.skipped
					]
				}) : null,
				i?.current ? /* @__PURE__ */ (0, Q.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, Q.jsx)("span", {
							className: "text-body-2-regular text-text-secondary",
							children: "正在生成"
						}),
						/* @__PURE__ */ (0, Q.jsx)(es, { item: i.current }),
						/* @__PURE__ */ (0, Q.jsx)(E, {
							size: "small",
							variant: "secondary",
							disabled: !!r.busy,
							onClick: () => o(`ignore-${i.current.id}`, `${Qo}/ignore`, { id: i.current.id }, "已忽略正在生成的作品"),
							children: "忽略"
						})
					]
				}) : /* @__PURE__ */ (0, Q.jsx)(N, { children: "当前没有正在生成的作品。" }),
				/* @__PURE__ */ (0, Q.jsx)(ns, {
					title: "排队",
					items: i?.queued || [],
					empty: "队列是空的。",
					action: "忽略",
					busy: r.busy,
					onAction: (e) => o(`ignore-${e.id}`, `${Qo}/ignore`, { id: e.id }, "已忽略")
				}),
				/* @__PURE__ */ (0, Q.jsx)(ns, {
					title: "失败",
					items: i?.failed || [],
					empty: "没有失败的作品。",
					action: "重试",
					busy: r.busy,
					onAction: (e) => o(`retry-${e.id}`, `${Qo}/retry`, { id: e.id }, "已重新排队")
				}),
				/* @__PURE__ */ (0, Q.jsx)(ns, {
					title: "已忽略",
					items: i?.skipped || [],
					empty: "没有已忽略的作品。",
					action: "重试",
					busy: r.busy,
					onAction: (e) => o(`retry-${e.id}`, `${Qo}/retry`, { id: e.id }, "已重新排队")
				})
			]
		})]
	});
}
function ns({ title: e, items: t, empty: n, action: r, busy: i, onAction: a }) {
	return /* @__PURE__ */ (0, Q.jsxs)("div", { children: [/* @__PURE__ */ (0, Q.jsx)("p", {
		className: "text-body-medium text-text-primary",
		children: e
	}), t.length ? /* @__PURE__ */ (0, Q.jsx)("ul", {
		className: "mt-1 flex flex-col",
		children: t.map((e) => /* @__PURE__ */ (0, Q.jsxs)("li", {
			className: "flex flex-wrap items-center gap-2 border-t border-separator-border py-2",
			children: [
				/* @__PURE__ */ (0, Q.jsx)(es, { item: e }),
				e.message ? /* @__PURE__ */ (0, Q.jsx)("span", {
					className: "text-body-2-regular text-text-secondary",
					children: e.message
				}) : null,
				/* @__PURE__ */ (0, Q.jsx)(E, {
					size: "small",
					variant: "secondary",
					disabled: !!i,
					onClick: () => a(e),
					children: r
				})
			]
		}, e.id))
	}) : /* @__PURE__ */ (0, Q.jsx)(N, { children: n })] });
}
// src/react/settings/configuration-shape.ts
function rs(e) {
	let t = e.downloads;
	if (!t) return null;
	let n = t.media_sources ?? [];
	return {
		cloud: n.some((e) => Ye.includes(e)),
		has115: n.includes("115"),
		pikpak: n.includes("pikpak"),
		pikpakRoots: t.pikpak_roots.length > 0,
		pikpakLoggedIn: t.pikpak.logged_in,
		browserLogin: t.pikpak_browser.available
	};
}
function is(e) {
	let t = e.tunnel;
	return {
		port: !!(e.editable && e.port_editable !== !1),
		addresses: e.network ? 1 + Number(!!(e.network.lan_url || e.network.ip_url)) + Number(!!(e.network.lan_url && e.network.ip_url)) : 0,
		networkEditable: !!e.network?.editable,
		lan: e.network?.host === "0.0.0.0",
		proxyAddress: e.peach_proxy?.mode === "proxy" || !!e.peach_proxy?.needs_selection,
		access: e.access?.mode ?? "",
		tunnelNamed: !!t?.named_available,
		tunnelNamedMode: !!(t?.named_available && t.mode === "named"),
		tunnelNote: !!(t && (!t.available || t.state === "starting" || t.state === "running" && t.url))
	};
}
function as(e) {
	let t = e.updates, n = e.update_job?.state ?? "idle", r = !t || t.state === "unchecked" && !t.checked_at && n === "idle", i = +!!t?.package_kind + (r ? 0 : +!!t?.checked_at + (t?.state === "unchecked" ? 0 : 1) + (n === "idle" ? 0 : 1)), a = e.automatic_updates, o = e.storage;
	return {
		releaseFacts: t?.package_kind ? 5 : 4,
		releaseNotes: i,
		autoUpdateHelp: !(!a || a.available && !a.download_available),
		startupNote: !!e.startup?.message,
		desktopNote: !!e.startup?.desktop_message,
		storageRows: o?.usage?.categories.length ?? 0,
		storageNotes: o && !o.relocation.available ? 1 : 0,
		reporting: !!e.remote_reporting,
		reportingIdle: !(!e.remote_reporting || e.remote_reporting.available),
		sharing: !!e.library_sharing,
		sharingNotice: !!e.library_sharing?.notice,
		sharingIdle: !(!e.library_sharing || e.library_sharing.available),
		facts: e.facts.map((e) => e.term),
		uninstall: !!e.uninstall,
		uninstallHelp: !!e.uninstall?.available
	};
}
// src/react/settings/configuration-page.tsx
function os({ receipt: e, reopenTutorial: t, section: n = "", diagnostics: r }) {
	let i = X({
		queryKey: Ze,
		queryFn: ({ signal: e }) => nn(e)
	}), a = i.data;
	return a ? /* @__PURE__ */ (0, Q.jsx)(ls, {
		data: a,
		receipt: e,
		reopenTutorial: t,
		section: n,
		diagnostics: r,
		refreshing: i.isFetching,
		reload: () => {
			i.refetch({ cancelRefetch: !1 });
		}
	}) : /* @__PURE__ */ (0, Q.jsx)("div", {
		className: "ui-configpage",
		children: /* @__PURE__ */ (0, Q.jsx)(F, {
			tone: "error",
			title: "配置读取失败",
			children: i.error ? q(i.error) : "未取得配置，请刷新页面重试。"
		})
	});
}
function ss({ data: e, sections: t, reload: n, refreshing: r }) {
	return /* @__PURE__ */ (0, Q.jsx)(Q.Fragment, { children: t.map((t) => {
		let i = e.section_errors?.[t];
		return i ? /* @__PURE__ */ (0, Q.jsx)(F, {
			tone: "error",
			title: i.title,
			action: /* @__PURE__ */ (0, Q.jsx)(E, {
				variant: "secondary",
				size: "small",
				onClick: n,
				...K(r),
				children: "重新读取"
			}),
			children: i.message
		}, t) : null;
	}) });
}
var cs = 0;
function ls({ data: e, receipt: t, reopenTutorial: n, section: r, diagnostics: i, reload: a, refreshing: o }) {
	let [s] = (0, Z.useState)(() => `board-tabs-${++cs}`), [c, l] = (0, Z.useState)(r), u = (0, Z.useRef)(null), d = (0, Z.useRef)(c);
	(0, Z.useEffect)(() => {
		l(r);
	}, [r]), (0, Z.useEffect)(() => {
		let t = rs(e);
		t && Sn("downloads", t), Sn("network", is(e)), Sn("maintenance", as(e));
	}, [e]), (0, Z.useLayoutEffect)(() => {
		if (d.current === c) return;
		d.current = c;
		let e = u.current?.querySelector("[role=\"tablist\"]"), t = u.current?.querySelector(".ui-board-group-active");
		if (!e || !t) return;
		let n = parseFloat(getComputedStyle(e).top);
		if (!Number.isFinite(n) || e.getBoundingClientRect().top > n + 1) return;
		let r = matchMedia("(max-width:900px)").matches ? e.getBoundingClientRect().bottom + 8 : n;
		window.scrollTo(0, Math.max(0, window.scrollY + t.getBoundingClientRect().top - r));
	}, [c]);
	let f = (e) => {
		l(e), kn(On(e), {
			replace: !0,
			state: gn.navigation.location.state
		});
	}, [p, m] = (0, Z.useState)(() => matchMedia("(max-width:900px)").matches);
	(0, Z.useEffect)(() => {
		let e = matchMedia("(max-width:900px)"), t = () => m(e.matches);
		return e.addEventListener("change", t), () => e.removeEventListener("change", t);
	}, []);
	let h = (0, Z.useRef)([]), g = {
		data: e,
		receipt: t
	}, _ = (t) => /* @__PURE__ */ (0, Q.jsx)(ss, {
		data: e,
		sections: t,
		reload: a,
		refreshing: o
	}), v = [
		"peach_proxy",
		"access",
		"tunnel",
		"push_discovery",
		...e.editable && e.port_editable !== !1 ? ["media_sources"] : []
	], y = !!(e.peach_proxy || e.access || e.tunnel || e.editable && e.port_editable !== !1 || v.some((t) => e.section_errors?.[t])), b = e.downloads, x = [
		{
			title: "媒体库与入库",
			body: (n) => /* @__PURE__ */ (0, Q.jsxs)("div", {
				...er(n),
				children: [
					_([
						"media_sources",
						"library_count",
						"mount_dependencies"
					]),
					!e.section_errors?.media_sources && !e.section_errors?.library_count ? /* @__PURE__ */ (0, Q.jsx)(to, { ...g }) : null,
					/* @__PURE__ */ (0, Q.jsx)(yo, { receipt: t }),
					/* @__PURE__ */ (0, Q.jsx)(fo, { receipt: t })
				]
			})
		},
		{
			title: "来源与订阅",
			body: (e) => /* @__PURE__ */ (0, Q.jsx)(Xo, {
				...g,
				panel: e,
				issues: _(["entry_links"])
			})
		},
		...b || e.section_errors?.downloads ? [{
			title: "下载渠道",
			body: (e) => /* @__PURE__ */ (0, Q.jsx)(hr, {
				initial: b,
				receipt: t,
				panel: e,
				issues: _(["downloads"])
			})
		}] : [],
		...y ? [{
			title: "网络与访问",
			body: (e) => /* @__PURE__ */ (0, Q.jsx)(Fo, {
				...g,
				panel: e,
				issues: _(v)
			})
		}] : [],
		{
			title: "应用与维护",
			body: (e) => /* @__PURE__ */ (0, Q.jsxs)("div", {
				...er(e),
				children: [
					_([
						"startup",
						"uninstall",
						"storage",
						"remote_reporting",
						"library_sharing",
						"updates",
						"update_job",
						"automatic_updates",
						"facts"
					]),
					/* @__PURE__ */ (0, Q.jsx)(ba, { ...g }),
					/* @__PURE__ */ (0, Q.jsx)(po, { receipt: t }),
					/* @__PURE__ */ (0, Q.jsx)(ts, {
						active: e.active,
						receipt: t
					}),
					/* @__PURE__ */ (0, Q.jsx)(ca, {
						...g,
						reopenTutorial: n
					})
				]
			})
		},
		{
			title: "系统诊断",
			body: (e) => /* @__PURE__ */ (0, Q.jsx)("div", {
				...er(e),
				children: e.active ? i : null
			})
		}
	], S = Math.max(0, x.findIndex((e) => e.title === c)), C = (e, t) => {
		let n = x.length - 1, r;
		if (e.key === "ArrowRight" || e.key === "ArrowDown") r = t === n ? 0 : t + 1;
		else if (e.key === "ArrowLeft" || e.key === "ArrowUp") r = t === 0 ? n : t - 1;
		else if (e.key === "Home") r = 0;
		else if (e.key === "End") r = n;
		else return;
		e.preventDefault(), f(x[r].title), h.current[r]?.focus();
	};
	return /* @__PURE__ */ (0, Q.jsxs)("div", {
		ref: u,
		className: "ui-configpage",
		children: [/* @__PURE__ */ (0, Q.jsx)(Dt, {
			className: "ui-board-local-nav",
			role: "tablist",
			"aria-label": "配置分区",
			"data-section-nav": "",
			"data-section-items": "",
			"data-pill-nav": "",
			"aria-orientation": p ? "horizontal" : "vertical",
			children: x.map(({ title: e }, t) => /* @__PURE__ */ (0, Q.jsx)("button", {
				ref: (e) => {
					h.current[t] = e;
				},
				type: "button",
				role: "tab",
				id: `${s}-tab-${t}`,
				"aria-controls": `${s}-panel-${t}-0`,
				"aria-selected": t === S,
				"data-pill-selected": t === S ? "" : void 0,
				"data-pill-variant": "gray",
				tabIndex: t === S ? 0 : -1,
				onClick: () => f(e),
				onKeyDown: (e) => C(e, t),
				children: e
			}, e))
		}), x.map(({ title: e, body: t }, n) => /* @__PURE__ */ (0, Q.jsxs)(Z.Fragment, { children: [/* @__PURE__ */ (0, Q.jsx)("h2", {
			className: "ui-configgroup",
			children: e
		}), t({
			index: n,
			id: `${s}-panel-${n}-0`,
			labelledBy: `${s}-tab-${n}`,
			active: n === S
		})] }, e))]
	});
}
export { os as ConfigurationPage };

//# debugId=58c712d9-b23e-4cd5-8ffc-45ca368c7bd4