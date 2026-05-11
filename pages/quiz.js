import { useState } from 'react';
import Head from 'next/head';

const questions = [
  { id: 'skill', label: '你有哪些技能？', options: ['编程','写作','设计','翻译','其他'] },
  { id: 'time', label: '每天能投入多少时间？', options: ['1小时','3小时','5小时+'] },
  { id: 'income', label: '期望月收入？', options: ['¥1000','¥3000','¥5000+'] },
  { id: 'face', label: '愿意露脸吗？', options: ['愿意','不愿意'] },
];

function recommend(skill, time, income, face) {
  if (skill === '编程' && time === '5小时+') return 'AI开发/接外包';
  if (skill === '写作') return 'AI代写/自媒体';
  if (skill === '设计') return '设计接单/卖模板';
  if (skill === '翻译') return '翻译接单';
  return 'AI代写（门槛最低）';
}

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  
  const q = questions[step];
  if (!q) {
    const r = recommend(answers.skill, answers.time, answers.income, answers.face);
    return (
      <div className="min-h-screen bg-bg"><div className="max-w-2xl mx-auto p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">推荐结果</h1>
        <p className="text-xl">推荐方向：<strong>{r}</strong></p>
        <button onClick={()=>{setStep(0);setAnswers({})}} className="mt-8 px-6 py-3 bg-primary text-white rounded-xl">重新测试</button>
      </div></div>
    );
  }
  return (
    <div className="min-h-screen bg-bg"><div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">{q.label}</h1>
      <div className="grid grid-cols-2 gap-4">
        {q.options.map(o => (
          <button key={o} onClick={()=>{setAnswers({...answers,[q.id]:o});setStep(step+1);}}
            className="p-4 border border-border rounded-xl hover:bg-bg-hover text-left">
            {o}
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-text-secondary">第 {step+1}/4 题</p>
    </div></div>
  );
}
