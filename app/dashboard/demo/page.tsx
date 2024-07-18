export default async function Page() {
  let diff =
    '- Acute lumbar go with left-sided sciatica (primary diagnosis)\\n- Ruptured disc\\n- Nerve impingement\\n- Degenerative disc disease\\n- Muscle strain\\n- Spinal stenosis\\n- Piriformis syndrome\\n\\nAlternative treatment options:\\n- Continue physical therapy\\n- Non-steroidal anti-inflammatory drugs (NSAIDs)\\n- Heat or ice therapy\\n- Gentle stretching exercises\\n- Acupuncture\\n- Chiropractic care\\n- Epidural steroid injections (if conservative treatments fail)';
  return (
    <div className="w-full">
      <div className="mb-8 flex w-full flex-col">
        <div className="my-4">Demo Page</div>
        <textarea>{diff}</textarea>

        <div>{diff}</div>
      </div>
    </div>
  );
}
