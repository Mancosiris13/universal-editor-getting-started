import { h as now, o as elementTransitionEnd } from '../shared/utils.min.mjs';

function freeMode({
  swiper: e, extendParams: t, emit: o, once: n,
}) {
  t({
    freeMode: {
      enabled: !1, momentum: !0, momentumRatio: 1, momentumBounce: !0, momentumBounceRatio: 1, momentumVelocityRatio: 1, sticky: !1, minimumVelocity: 0.02,
    },
  }), Object.assign(e, {
    freeMode: {
      onTouchStart() { if (e.params.cssMode) return; const t = e.getTranslate(); e.setTranslate(t), e.setTransition(0), e.touchEventsData.velocities.length = 0, e.freeMode.onTouchEnd({ currentPos: e.rtl ? e.translate : -e.translate }); },
      onTouchMove() { if (e.params.cssMode) return; const { touchEventsData: t, touches: o } = e; t.velocities.length === 0 && t.velocities.push({ position: o[e.isHorizontal() ? 'startX' : 'startY'], time: t.touchStartTime }), t.velocities.push({ position: o[e.isHorizontal() ? 'currentX' : 'currentY'], time: now() }); },
      onTouchEnd({ currentPos: t }) {
        if (e.params.cssMode) return; const {
          params: s, wrapperEl: i, rtlTranslate: a, snapGrid: r, touchEventsData: l,
        } = e; const m = now() - l.touchStartTime; if (t < -e.minTranslate())e.slideTo(e.activeIndex); else if (t > -e.maxTranslate())e.slides.length < r.length ? e.slideTo(r.length - 1) : e.slideTo(e.slides.length - 1); else { if (s.freeMode.momentum) { if (l.velocities.length > 1) { const t = l.velocities.pop(); const o = l.velocities.pop(); const n = t.position - o.position; const i = t.time - o.time; e.velocity = n / i, e.velocity /= 2, Math.abs(e.velocity) < s.freeMode.minimumVelocity && (e.velocity = 0), (i > 150 || now() - t.time > 300) && (e.velocity = 0); } else e.velocity = 0; e.velocity *= s.freeMode.momentumVelocityRatio, l.velocities.length = 0; let t = 1e3 * s.freeMode.momentumRatio; const m = e.velocity * t; let c = e.translate + m; a && (c = -c); let d; let u = !1; const f = 20 * Math.abs(e.velocity) * s.freeMode.momentumBounceRatio; let p; if (c < e.maxTranslate())s.freeMode.momentumBounce ? (c + e.maxTranslate() < -f && (c = e.maxTranslate() - f), d = e.maxTranslate(), u = !0, l.allowMomentumBounce = !0) : c = e.maxTranslate(), s.loop && s.centeredSlides && (p = !0); else if (c > e.minTranslate())s.freeMode.momentumBounce ? (c - e.minTranslate() > f && (c = e.minTranslate() + f), d = e.minTranslate(), u = !0, l.allowMomentumBounce = !0) : c = e.minTranslate(), s.loop && s.centeredSlides && (p = !0); else if (s.freeMode.sticky) { let t; for (let e = 0; e < r.length; e += 1) if (r[e] > -c) { t = e; break; }c = Math.abs(r[t] - c) < Math.abs(r[t - 1] - c) || e.swipeDirection === 'next' ? r[t] : r[t - 1], c = -c; } if (p && n('transitionEnd', () => { e.loopFix(); }), e.velocity !== 0) { if (t = a ? Math.abs((-c - e.translate) / e.velocity) : Math.abs((c - e.translate) / e.velocity), s.freeMode.sticky) { const o = Math.abs((a ? -c : c) - e.translate); const n = e.slidesSizesGrid[e.activeIndex]; t = o < n ? s.speed : o < 2 * n ? 1.5 * s.speed : 2.5 * s.speed; } } else if (s.freeMode.sticky) return void e.slideToClosest(); s.freeMode.momentumBounce && u ? (e.updateProgress(d), e.setTransition(t), e.setTranslate(c), e.transitionStart(!0, e.swipeDirection), e.animating = !0, elementTransitionEnd(i, () => { e && !e.destroyed && l.allowMomentumBounce && (o('momentumBounce'), e.setTransition(s.speed), setTimeout(() => { e.setTranslate(d), elementTransitionEnd(i, () => { e && !e.destroyed && e.transitionEnd(); }); }, 0)); })) : e.velocity ? (o('_freeModeNoMomentumRelease'), e.updateProgress(c), e.setTransition(t), e.setTranslate(c), e.transitionStart(!0, e.swipeDirection), e.animating || (e.animating = !0, elementTransitionEnd(i, () => { e && !e.destroyed && e.transitionEnd(); }))) : e.updateProgress(c), e.updateActiveIndex(), e.updateSlidesClasses(); } else { if (s.freeMode.sticky) return void e.slideToClosest(); s.freeMode && o('_freeModeNoMomentumRelease'); }(!s.freeMode.momentum || m >= s.longSwipesMs) && (o('_freeModeStaticRelease'), e.updateProgress(), e.updateActiveIndex(), e.updateSlidesClasses()); }
      },
    },
  });
} export { freeMode as default };
// # sourceMappingURL=free-mode.min.mjs.map
