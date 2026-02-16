// Translated Security Quiz Questions - Uses language from context
// Returns questions with translated text based on current language

export const getTranslatedQuestions = (t) => {
  return [
    {
      id: 'industry',
      text: t('quiz.industry'),
      subtitle: t('quiz.industry_subtitle'),
      type: 'multiple',
      options: [
        { value: 'retail', label: t('quiz.industry_retail'), desc: t('quiz.industry_retail_desc'), icon: 'ShoppingCart' },
        { value: 'services', label: t('quiz.industry_services'), desc: t('quiz.industry_services_desc'), icon: 'Briefcase' },
        { value: 'restaurant', label: t('quiz.industry_restaurant'), desc: t('quiz.industry_restaurant_desc'), icon: 'UtensilsCrossed' },
        { value: 'health', label: t('quiz.industry_health'), desc: t('quiz.industry_health_desc'), icon: 'Heart' },
        { value: 'freelance', label: t('quiz.industry_freelance'), desc: t('quiz.industry_freelance_desc'), icon: 'User' },
        { value: 'manufacturing', label: t('quiz.industry_manufacturing'), desc: t('quiz.industry_manufacturing_desc'), icon: 'Factory' },
        { value: 'education', label: t('quiz.industry_education'), desc: t('quiz.industry_education_desc'), icon: 'GraduationCap' },
        { value: 'nonprofit', label: t('quiz.industry_nonprofit'), desc: t('quiz.industry_nonprofit_desc'), icon: 'HeartHandshake' },
        { value: 'finance', label: t('quiz.industry_finance'), desc: t('quiz.industry_finance_desc'), icon: 'Landmark' },
        { value: 'tech', label: t('quiz.industry_tech'), desc: t('quiz.industry_tech_desc'), icon: 'Monitor' }
      ]
    },
    {
      id: 'threat_exposure',
      text: t('quiz.threat_exposure'),
      subtitle: t('quiz.threat_exposure_subtitle'),
      type: 'multiple',
      options: [
        { value: 'phishing_emails', label: t('quiz.threat_phishing'), desc: t('quiz.threat_phishing_desc'), icon: 'Mail' },
        { value: 'fake_invoices_bec', label: t('quiz.threat_bec'), desc: t('quiz.threat_bec_desc'), icon: 'Receipt' },
        { value: 'whatsapp_sms_scams', label: t('quiz.threat_smishing'), desc: t('quiz.threat_smishing_desc'), icon: 'Smartphone' },
        { value: 'phone_scams', label: t('quiz.threat_vishing'), desc: t('quiz.threat_vishing_desc'), icon: 'Phone' },
        { value: 'ceo_impersonation', label: t('quiz.threat_ceo_fraud'), desc: t('quiz.threat_ceo_fraud_desc'), icon: 'UserX' },
        { value: 'account_takeover', label: t('quiz.threat_account_takeover'), desc: t('quiz.threat_account_takeover_desc'), icon: 'KeyRound' },
        { value: 'ransomware_phishing', label: t('quiz.threat_ransomware'), desc: t('quiz.threat_ransomware_desc'), icon: 'Lock' },
        { value: 'vendor_fraud', label: t('quiz.threat_vendor_fraud'), desc: t('quiz.threat_vendor_fraud_desc'), icon: 'Building2' }
      ]
    },
    {
      id: 'current_controls',
      text: t('quiz.current_controls'),
      subtitle: t('quiz.current_controls_subtitle'),
      type: 'multiple',
      options: [
        { value: 'none', label: t('quiz.controls_none'), desc: t('quiz.controls_none_desc'), icon: 'Ban' },
        { value: 'basic_antivirus', label: t('quiz.controls_antivirus'), desc: t('quiz.controls_antivirus_desc'), icon: 'Shield' },
        { value: 'spam_filter', label: t('quiz.controls_spam_filter'), desc: t('quiz.controls_spam_filter_desc'), icon: 'MailX' },
        { value: 'mfa_partial', label: t('quiz.controls_mfa'), desc: t('quiz.controls_mfa_desc'), icon: 'Fingerprint' },
        { value: 'security_training', label: t('quiz.controls_training'), desc: t('quiz.controls_training_desc'), icon: 'BookOpen' },
        { value: 'dedicated_it', label: t('quiz.controls_it_person'), desc: t('quiz.controls_it_person_desc'), icon: 'UserCog' }
      ]
    },
    {
      id: 'security_budget',
      text: t('quiz.security_budget'),
      subtitle: t('quiz.security_budget_subtitle'),
      type: 'multiple',
      options: [
        { value: 'free', label: t('quiz.budget_free'), desc: t('quiz.budget_free_desc'), icon: 'CircleDollarSign' },
        { value: 'low', label: t('quiz.budget_low'), desc: t('quiz.budget_low_desc'), icon: 'Coins' },
        { value: 'medium_low', label: t('quiz.budget_medium_low'), desc: t('quiz.budget_medium_low_desc'), icon: 'Wallet' },
        { value: 'medium', label: t('quiz.budget_medium'), desc: t('quiz.budget_medium_desc'), icon: 'BadgeDollarSign' },
        { value: 'high', label: t('quiz.budget_high'), desc: t('quiz.budget_high_desc'), icon: 'TrendingUp' }
      ]
    },
    {
      id: 'team_size',
      text: t('quiz.team_size'),
      subtitle: t('quiz.team_size_subtitle'),
      type: 'multiple',
      options: [
        { value: 'solo', label: t('quiz.team_size_solo'), desc: t('quiz.team_size_solo_desc'), icon: 'User' },
        { value: 'small', label: t('quiz.team_size_small'), desc: t('quiz.team_size_small_desc'), icon: 'Users' },
        { value: 'medium', label: t('quiz.team_size_medium'), desc: t('quiz.team_size_medium_desc'), icon: 'Users2' },
        { value: 'large', label: t('quiz.team_size_large'), desc: t('quiz.team_size_large_desc'), icon: 'Building' },
        { value: 'enterprise', label: t('quiz.team_size_enterprise'), desc: t('quiz.team_size_enterprise_desc'), icon: 'Building2' }
      ]
    },
    {
      id: 'tech_maturity',
      text: t('quiz.tech_maturity'),
      subtitle: t('quiz.tech_maturity_subtitle'),
      type: 'multiple',
      options: [
        { value: 'basic', label: t('quiz.tech_maturity_basic'), desc: t('quiz.tech_maturity_basic_desc'), icon: 'Smartphone' },
        { value: 'intermediate', label: t('quiz.tech_maturity_intermediate'), desc: t('quiz.tech_maturity_intermediate_desc'), icon: 'Laptop' },
        { value: 'advanced', label: t('quiz.tech_maturity_advanced'), desc: t('quiz.tech_maturity_advanced_desc'), icon: 'Server' }
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
