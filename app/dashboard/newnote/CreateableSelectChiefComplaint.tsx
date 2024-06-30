import React, { useEffect, useState } from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { fetchTemplates } from '@/app/lib/data';
import { ActionMeta, SingleValue, InputActionMeta } from 'react-select';
import { Template, TemplateOption } from '@/app/lib/definitions';

const structureTemplates = (fetchedTemplates: Template[]): TemplateOption[] => {
  return fetchedTemplates.map((template) => ({
    value: template,
    label: `${template.chief_complaint}`,
  }));
};

const filterTemplates = (inputValue: string, templates: TemplateOption[]) => {
  return templates.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase()),
  );
};

const loadOptions = async (inputValue: string) => {
  try {
    const fetchedTemplates = await fetchTemplates();
    if (!fetchedTemplates) {
      return [];
    }
    const templates = structureTemplates(fetchedTemplates);
    return filterTemplates(inputValue, templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
};

interface TemplateSelectProps {
  onTemplateSelect: (
    // newValue: SingleValue<TemplateOption>,
    selectedTemplate: TemplateOption,
    actionMeta: ActionMeta<TemplateOption>,
  ) => void;
  selectedTemplate?: TemplateOption;
}

const CreateableSelectChiefComplaint: React.FC<TemplateSelectProps> = ({
  onTemplateSelect,
  selectedTemplate,
}) => (
  <AsyncCreatableSelect
    cacheOptions
    defaultOptions
    value={selectedTemplate}
    placeholder="Select or type Chief Complaint..."
    loadOptions={loadOptions}
    onChange={onTemplateSelect}
    styles={{
      input: (base) => ({
        ...base,
        'input:focus': {
          boxShadow: 'none',
        },
      }),
    }}
  />
);

export default CreateableSelectChiefComplaint;
