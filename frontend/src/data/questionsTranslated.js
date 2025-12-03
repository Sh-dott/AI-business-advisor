// Translated Quiz Questions - Uses language from context
// Returns questions with translated text based on current language

export const getTranslatedQuestions = (t) => {
  return [
    {
      id: 'business',
      text: t('quiz.business_type'),
      subtitle: t('quiz.business_type_subtitle'),
      type: 'multiple',
      options: [
        { value: 'retail', label: t('quiz.business_type_retail'), desc: t('quiz.business_type_retail_desc') },
        { value: 'services', label: t('quiz.business_type_services'), desc: t('quiz.business_type_services_desc') },
        { value: 'restaurant', label: t('quiz.business_type_restaurant'), desc: t('quiz.business_type_restaurant_desc') },
        { value: 'health', label: t('quiz.business_type_health'), desc: t('quiz.business_type_health_desc') },
        { value: 'freelance', label: t('quiz.business_type_freelance'), desc: t('quiz.business_type_freelance_desc') },
        { value: 'manufacturing', label: t('quiz.business_type_manufacturing'), desc: t('quiz.business_type_manufacturing_desc') },
        { value: 'education', label: t('quiz.business_type_education'), desc: t('quiz.business_type_education_desc') },
        { value: 'nonprofit', label: t('quiz.business_type_nonprofit'), desc: t('quiz.business_type_nonprofit_desc') }
      ]
    },
    {
      id: 'challenge',
      text: t('quiz.challenge'),
      subtitle: t('quiz.challenge_subtitle'),
      type: 'multiple',
      options: [
        { value: 'customers', label: t('quiz.challenge_customers'), desc: t('quiz.challenge_customers_desc') },
        { value: 'retention', label: t('quiz.challenge_retention'), desc: t('quiz.challenge_retention_desc') },
        { value: 'cashflow', label: t('quiz.challenge_cashflow'), desc: t('quiz.challenge_cashflow_desc') },
        { value: 'time_management', label: t('quiz.challenge_time_management'), desc: t('quiz.challenge_time_management_desc') },
        { value: 'inventory', label: t('quiz.challenge_inventory'), desc: t('quiz.challenge_inventory_desc') },
        { value: 'communication', label: t('quiz.challenge_communication'), desc: t('quiz.challenge_communication_desc') },
        { value: 'team_management', label: t('quiz.challenge_team_management'), desc: t('quiz.challenge_team_management_desc') },
        { value: 'data_tracking', label: t('quiz.challenge_data_tracking'), desc: t('quiz.challenge_data_tracking_desc') },
        { value: 'online_presence', label: t('quiz.challenge_online_presence'), desc: t('quiz.challenge_online_presence_desc') },
        { value: 'compliance', label: t('quiz.challenge_compliance'), desc: t('quiz.challenge_compliance_desc') }
      ]
    },
    {
      id: 'budget',
      text: t('quiz.budget'),
      subtitle: t('quiz.budget_subtitle'),
      type: 'multiple',
      options: [
        { value: 'free', label: t('quiz.budget_free'), desc: t('quiz.budget_free_desc') },
        { value: 'low', label: t('quiz.budget_low'), desc: t('quiz.budget_low_desc') },
        { value: 'medium_low', label: t('quiz.budget_medium_low'), desc: t('quiz.budget_medium_low_desc') },
        { value: 'medium', label: t('quiz.budget_medium'), desc: t('quiz.budget_medium_desc') },
        { value: 'medium_high', label: t('quiz.budget_medium_high'), desc: t('quiz.budget_medium_high_desc') },
        { value: 'high', label: t('quiz.budget_high'), desc: t('quiz.budget_high_desc') }
      ]
    },
    {
      id: 'team_size',
      text: t('quiz.team_size'),
      subtitle: t('quiz.team_size_subtitle'),
      type: 'multiple',
      options: [
        { value: 'solo', label: t('quiz.team_size_solo'), desc: t('quiz.team_size_solo_desc') },
        { value: 'small', label: t('quiz.team_size_small'), desc: t('quiz.team_size_small_desc') },
        { value: 'medium', label: t('quiz.team_size_medium'), desc: t('quiz.team_size_medium_desc') },
        { value: 'large', label: t('quiz.team_size_large'), desc: t('quiz.team_size_large_desc') }
      ]
    },
    {
      id: 'tech_level',
      text: t('quiz.tech_level'),
      subtitle: t('quiz.tech_level_subtitle'),
      type: 'multiple',
      options: [
        { value: 'basic', label: t('quiz.tech_level_basic'), desc: t('quiz.tech_level_basic_desc') },
        { value: 'intermediate', label: t('quiz.tech_level_intermediate'), desc: t('quiz.tech_level_intermediate_desc') },
        { value: 'advanced', label: t('quiz.tech_level_advanced'), desc: t('quiz.tech_level_advanced_desc') }
      ]
    },
    {
      id: 'description',
      text: t('quiz.description'),
      subtitle: t('quiz.description_subtitle'),
      type: 'textarea',
      placeholder: t('quiz.description_placeholder')
    }
  ];
};
