const { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, HeadingLevel, PageBreak } = require('docx');
const path = require('path');

// Try to load translations, fallback to basic English if not available
let t;
try {
  t = require('../locales/export-translations').t;
} catch (error) {
  t = (lang, key) => {
    const fallbackTranslations = {
      businessProgram: 'Anti-Phishing Protection Program',
      preparedFor: 'Prepared for',
      generatedOn: 'Generated on',
      executiveSummary: 'Executive Summary',
      yourBusinessProfile: 'Your Security Profile',
      industry: 'Industry',
      threatExposure: 'Threat Exposure',
      currentControls: 'Current Controls',
      securityBudget: 'Security Budget',
      techMaturity: 'Tech Maturity',
      teamSize: 'Team Size',
      diagnosis: 'Risk Diagnosis & Threat Model',
      securityRecommendations: 'Security Recommendations',
      protectionRoadmap: 'Protection Roadmap',
      securityKpis: 'Security KPIs',
      incidentResponse: 'Incident Response Playbook',
      securityPolicies: 'Security Policies',
      confidential: 'CONFIDENTIAL - For Internal Use Only'
    };
    return fallbackTranslations[key] || key;
  };
}

/**
 * Generates a customized anti-phishing protection program as a Word document
 */
class DocumentGenerator {
  constructor() {
    this.documentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.language = 'en';
  }

  setLanguage(lang) {
    this.language = lang || 'en';
  }

  translate(key) {
    return t(this.language, key);
  }

  /**
   * Generate complete security protection program document
   * @param {Object} userAnalysis - User's security profile
   * @param {Array} recommendations - Security recommendations
   * @param {string} documentType - 'summary' or 'standard'
   * @param {string} language - Language code (en, he)
   */
  async generateBusinessProgram(userAnalysis, recommendations, documentType = 'standard', language = 'en') {
    try {
      this.setLanguage(language);
      const children = [];
      const type = documentType === 'summary' ? 'summary' : 'standard';

      // Cover page
      children.push(...this.createCoverPage(userAnalysis));
      children.push(this.createPageBreak());

      // Executive Summary
      children.push(...this.createExecutiveSummary(userAnalysis, recommendations));
      children.push(this.createPageBreak());

      // Risk Diagnosis
      if (userAnalysis.diagnosis) {
        children.push(...this.createRiskDiagnosis(userAnalysis));
        children.push(this.createPageBreak());
      }

      // Security Recommendations
      children.push(...this.createSecurityRecommendations(recommendations));
      children.push(this.createPageBreak());

      // For summary - stop here with a quick roadmap
      if (type === 'summary') {
        if (userAnalysis.roadmap) {
          children.push(...this.createProtectionRoadmap(userAnalysis));
        }
      }

      // For standard - include full sections
      if (type === 'standard') {
        // Threat Model
        if (userAnalysis.threatModel) {
          children.push(...this.createThreatModel(userAnalysis));
          children.push(this.createPageBreak());
        }

        // Protection Roadmap
        if (userAnalysis.roadmap) {
          children.push(...this.createProtectionRoadmap(userAnalysis));
          children.push(this.createPageBreak());
        }

        // Security KPIs
        if (userAnalysis.kpis && userAnalysis.kpis.length > 0) {
          children.push(...this.createSecurityKPIs(userAnalysis));
          children.push(this.createPageBreak());
        }

        // Incident Response Playbook
        if (userAnalysis.incidentResponse) {
          children.push(...this.createIncidentResponsePlaybook(userAnalysis));
          children.push(this.createPageBreak());
        }

        // Security Policies
        children.push(...this.createSecurityPolicies());
      }

      // Footer
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${this.translate('generatedDocument')}: ${this.documentDate} | ${this.translate('confidential')}`,
              italics: true,
              color: '666666',
              size: 18
            })
          ],
          spacing: { before: 400 },
          alignment: AlignmentType.CENTER
        })
      );

      const doc = new Document({
        sections: [{ children }]
      });

      return doc;
    } catch (error) {
      throw new Error(`Failed to generate document: ${error.message}`);
    }
  }

  createCoverPage(userAnalysis) {
    return [
      new Paragraph({ text: '', spacing: { after: 600 } }),
      new Paragraph({
        children: [
          new TextRun({
            text: this.translate('businessProgram').toUpperCase(),
            bold: true,
            size: 48,
            color: '1e3a5f'
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: userAnalysis.businessName || 'Your Business',
            bold: true,
            size: 36,
            color: '333333'
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${this.translate('industry')}: ${userAnalysis.industry || 'General'}`,
            size: 24,
            color: '666666'
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 }
      }),
      new Paragraph({ text: '' }),
      new Paragraph({ text: '' }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${this.translate('generatedOn')}: ${this.documentDate}`,
            italics: true,
            color: '999999',
            size: 22
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: this.translate('confidential'),
            bold: true,
            color: 'DC143C',
            size: 20
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200 }
      })
    ];
  }

  createExecutiveSummary(userAnalysis, recommendations) {
    const paragraphs = [
      this.createHeading1(this.translate('executiveSummary')),
      this.createHeading2(this.translate('yourBusinessProfile'))
    ];

    // Profile table
    const profileFields = [
      [this.translate('industry'), userAnalysis.industry || 'N/A'],
      [this.translate('threatExposure'), userAnalysis.threatExposure || 'N/A'],
      [this.translate('currentControls'), userAnalysis.currentControls || 'N/A'],
      [this.translate('securityBudget'), userAnalysis.securityBudget || 'N/A'],
      [this.translate('techMaturity'), userAnalysis.techMaturity || 'N/A'],
      [this.translate('teamSize'), userAnalysis.teamSize || 'N/A']
    ];

    const profileRows = [
      new TableRow({
        children: [
          this.createTableHeaderCell('Category'),
          this.createTableHeaderCell('Details')
        ]
      }),
      ...profileFields.map(([label, value]) =>
        new TableRow({
          children: [
            this.createTableCell(label, true),
            this.createTableCell(String(value))
          ]
        })
      )
    ];

    paragraphs.push(
      new Table({ rows: profileRows, width: { size: 100, type: 'pct' } })
    );

    // Diagnosis summary
    if (userAnalysis.diagnosis) {
      paragraphs.push(new Paragraph({ text: '', spacing: { after: 200 } }));
      paragraphs.push(this.createHeading2(this.translate('riskAssessment')));
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${this.translate('riskLevel')}: `, bold: true }),
            new TextRun({
              text: (userAnalysis.diagnosis.riskLevel || 'medium').toUpperCase(),
              bold: true,
              color: this.getRiskColor(userAnalysis.diagnosis.riskLevel)
            })
          ],
          spacing: { after: 100 }
        })
      );
      if (userAnalysis.diagnosis.summary) {
        paragraphs.push(
          new Paragraph({
            text: userAnalysis.diagnosis.summary,
            spacing: { after: 200 }
          })
        );
      }
    }

    // Recommendations overview
    paragraphs.push(this.createHeading2(this.translate('securityRecommendations')));
    recommendations.forEach((rec, index) => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${index + 1}. ${rec.name}`, bold: true }),
            new TextRun({ text: ` (${rec.priority || 'Medium'})`, color: this.getPriorityColor(rec.priority) })
          ],
          spacing: { after: 50 }
        })
      );
    });

    return paragraphs;
  }

  createRiskDiagnosis(userAnalysis) {
    const diagnosis = userAnalysis.diagnosis;
    if (!diagnosis) return [];

    const paragraphs = [
      this.createHeading1(this.translate('diagnosis'))
    ];

    // Risk level banner
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({ text: `${this.translate('riskLevel')}: `, bold: true, size: 28 }),
          new TextRun({
            text: (diagnosis.riskLevel || 'medium').toUpperCase(),
            bold: true,
            size: 28,
            color: this.getRiskColor(diagnosis.riskLevel)
          })
        ],
        spacing: { after: 200 }
      })
    );

    // Summary
    if (diagnosis.summary) {
      paragraphs.push(new Paragraph({ text: diagnosis.summary, spacing: { after: 200 } }));
    }

    // Key Findings
    if (diagnosis.keyFindings && diagnosis.keyFindings.length > 0) {
      paragraphs.push(this.createHeading2(this.translate('keyFindings')));
      paragraphs.push(...this.createBulletPoints(diagnosis.keyFindings));
    }

    // Industry Context
    if (diagnosis.industryContext) {
      paragraphs.push(this.createHeading2(this.translate('industryContext')));
      paragraphs.push(new Paragraph({ text: diagnosis.industryContext, spacing: { after: 200 } }));
    }

    return paragraphs;
  }

  createThreatModel(userAnalysis) {
    const threatModel = userAnalysis.threatModel;
    if (!threatModel) return [];

    const paragraphs = [
      this.createHeading1(this.translate('threatModel'))
    ];

    // Attack Surface
    if (threatModel.attackSurface) {
      paragraphs.push(this.createHeading2(this.translate('attackSurface')));
      paragraphs.push(new Paragraph({ text: threatModel.attackSurface, spacing: { after: 200 } }));
    }

    // Top Threats Table
    if (threatModel.topThreats && threatModel.topThreats.length > 0) {
      paragraphs.push(this.createHeading2(this.translate('topThreats')));

      const threatRows = [
        new TableRow({
          children: [
            this.createTableHeaderCell('Threat'),
            this.createTableHeaderCell(this.translate('likelihood')),
            this.createTableHeaderCell(this.translate('impact')),
            this.createTableHeaderCell(this.translate('description'))
          ]
        }),
        ...threatModel.topThreats.map(threat =>
          new TableRow({
            children: [
              this.createTableCell(threat.name || '', true),
              this.createTableCell((threat.likelihood || '').toUpperCase()),
              this.createTableCell((threat.impact || '').toUpperCase()),
              this.createTableCell(threat.description || '')
            ]
          })
        )
      ];

      paragraphs.push(
        new Table({ rows: threatRows, width: { size: 100, type: 'pct' } })
      );
    }

    return paragraphs;
  }

  createSecurityRecommendations(recommendations) {
    const paragraphs = [
      this.createHeading1(this.translate('securityRecommendations')),
      new Paragraph({
        text: 'The following security controls have been selected specifically for your business threat profile:',
        spacing: { after: 300 }
      })
    ];

    const categoryLabels = {
      email_security: this.translate('categoryEmailSecurity'),
      identity_access: this.translate('categoryIdentityAccess'),
      awareness_training: this.translate('categoryAwarenessTraining'),
      process_ir: this.translate('categoryProcessIr')
    };

    recommendations.forEach((rec, index) => {
      // Name and priority
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${index + 1}. ${rec.name}`,
              bold: true,
              size: 28
            })
          ],
          spacing: { before: 300, after: 50 }
        })
      );

      // Category and Priority badges
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `[${categoryLabels[rec.category] || rec.category}]`,
              color: '0070C0',
              bold: true
            }),
            new TextRun({ text: '  |  ' }),
            new TextRun({
              text: `${this.translate('priority')}: ${rec.priority || 'Medium'}`,
              color: this.getPriorityColor(rec.priority),
              bold: true
            }),
            rec.totalScore ? new TextRun({
              text: `  |  Score: ${rec.totalScore}/155`,
              color: '666666'
            }) : new TextRun({ text: '' })
          ],
          spacing: { after: 150 }
        })
      );

      // Description
      if (rec.description) {
        paragraphs.push(new Paragraph({ text: rec.description, spacing: { after: 150 } }));
      }

      // Why This Matters
      if (rec.why) {
        paragraphs.push(this.createHeading3(this.translate('whyThisMatters')));
        paragraphs.push(
          new Paragraph({
            children: [new TextRun({ text: rec.why, italics: true })],
            spacing: { after: 150 }
          })
        );
      }

      // Implementation Steps
      if (rec.steps && rec.steps.length > 0) {
        paragraphs.push(this.createHeading3(this.translate('implementationSteps')));
        rec.steps.forEach((step, idx) => {
          paragraphs.push(
            new Paragraph({
              text: `${idx + 1}. ${step}`,
              spacing: { after: 50 },
              indent: { left: 360 }
            })
          );
        });
      }

      // Common Pitfalls
      if (rec.pitfalls && rec.pitfalls.length > 0) {
        paragraphs.push(this.createHeading3(this.translate('commonPitfalls')));
        paragraphs.push(...this.createBulletPoints(rec.pitfalls));
      }

      // Tool Categories
      if (rec.toolCategories && rec.toolCategories.length > 0) {
        paragraphs.push(this.createHeading3(this.translate('toolCategories')));
        paragraphs.push(
          new Paragraph({
            text: rec.toolCategories.join(', '),
            spacing: { after: 100 },
            color: '0070C0'
          })
        );
      }

      // Effort and Cost
      if (rec.estimatedEffort || rec.estimatedCost) {
        paragraphs.push(
          new Paragraph({
            children: [
              rec.estimatedEffort ? new TextRun({
                text: `${this.translate('estimatedEffort')}: ${rec.estimatedEffort}`,
                italics: true,
                color: '666666'
              }) : new TextRun({ text: '' }),
              (rec.estimatedEffort && rec.estimatedCost) ? new TextRun({ text: '  |  ' }) : new TextRun({ text: '' }),
              rec.estimatedCost ? new TextRun({
                text: `${this.translate('estimatedCost')}: ${rec.estimatedCost}`,
                italics: true,
                color: '666666'
              }) : new TextRun({ text: '' })
            ],
            spacing: { after: 200 }
          })
        );
      }
    });

    return paragraphs;
  }

  createProtectionRoadmap(userAnalysis) {
    const roadmap = userAnalysis.roadmap;
    if (!roadmap) return [];

    const paragraphs = [
      this.createHeading1(this.translate('protectionRoadmap'))
    ];

    const phases = [
      { label: this.translate('days30'), items: roadmap.days30 || [] },
      { label: this.translate('days60'), items: roadmap.days60 || [] },
      { label: this.translate('days90'), items: roadmap.days90 || [] }
    ];

    phases.forEach(phase => {
      if (phase.items.length > 0) {
        paragraphs.push(this.createHeading2(phase.label));
        paragraphs.push(...this.createBulletPoints(phase.items));
      }
    });

    return paragraphs;
  }

  createSecurityKPIs(userAnalysis) {
    const kpis = userAnalysis.kpis;
    if (!kpis || kpis.length === 0) return [];

    const paragraphs = [
      this.createHeading1(this.translate('securityKpis'))
    ];

    const kpiRows = [
      new TableRow({
        children: [
          this.createTableHeaderCell(this.translate('metric')),
          this.createTableHeaderCell(this.translate('baseline')),
          this.createTableHeaderCell(this.translate('target30')),
          this.createTableHeaderCell(this.translate('target90'))
        ]
      }),
      ...kpis.map(kpi =>
        new TableRow({
          children: [
            this.createTableCell(kpi.metric || '', true),
            this.createTableCell(kpi.baseline || ''),
            this.createTableCell(kpi.target30 || ''),
            this.createTableCell(kpi.target90 || '')
          ]
        })
      )
    ];

    paragraphs.push(
      new Table({ rows: kpiRows, width: { size: 100, type: 'pct' } })
    );

    return paragraphs;
  }

  createIncidentResponsePlaybook(userAnalysis) {
    const ir = userAnalysis.incidentResponse;
    if (!ir) return [];

    const paragraphs = [
      this.createHeading1(this.translate('incidentResponse'))
    ];

    if (ir.title) {
      paragraphs.push(this.createHeading2(ir.title));
    }

    // Steps by timeframe
    if (ir.steps && ir.steps.length > 0) {
      ir.steps.forEach(step => {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${this.translate('timeframe')}: ${step.timeframe || ''}`,
                bold: true,
                color: '1e3a5f'
              })
            ],
            spacing: { before: 200, after: 100 }
          })
        );
        if (step.actions && step.actions.length > 0) {
          paragraphs.push(...this.createBulletPoints(step.actions));
        }
      });
    }

    // Emergency Contacts
    if (ir.contacts) {
      paragraphs.push(this.createHeading2(this.translate('emergencyContacts')));
      paragraphs.push(new Paragraph({ text: ir.contacts, spacing: { after: 200 } }));
    }

    return paragraphs;
  }

  createSecurityPolicies() {
    const paragraphs = [
      this.createHeading1(this.translate('securityPolicies'))
    ];

    // Policy 1: Payment Change Verification
    paragraphs.push(this.createHeading2(this.translate('paymentVerification')));
    const paymentPolicy = this.language === 'he' ? [
      'כל בקשה לשינוי פרטי תשלום חייבת לעבור אימות טלפוני ישיר לספק, באמצעות מספר ידוע מראש',
      'אין לבצע שינויים בפרטי בנק/תשלום על סמך הודעת דוא"ל או הודעה טקסטואלית בלבד',
      'העברות מעל 5,000 שקל דורשות אישור מנהל שני',
      'תעד כל בקשה לשינוי ושמור רישום למשך 12 חודשים לפחות',
      'הודע לכל הספקים על מדיניות זו כדי שגם הם יוכלו לאמת בקשות חריגות'
    ] : [
      'Any request to change payment details MUST be verified by a direct phone call to the vendor using a known number',
      'Never change bank/payment details based solely on an email or text message',
      'Transfers over $5,000 require approval from a second manager',
      'Document every change request and maintain records for at least 12 months',
      'Notify all vendors of this policy so they can also verify unusual requests'
    ];
    paragraphs.push(...this.createBulletPoints(paymentPolicy));

    // Policy 2: Suspicious Message Reporting
    paragraphs.push(this.createHeading2(this.translate('suspiciousReporting')));
    const reportingPolicy = this.language === 'he' ? [
      'אם קיבלת הודעה חשודה - אל תלחץ על קישורים ואל תפתח קבצים מצורפים',
      'העבר את ההודעה המקורית (כקובץ מצורף) לצוות ה-IT או לאיש הקשר האבטחי המיועד',
      'אם לחצת בטעות - נתק מיד מהרשת והודע לצוות IT',
      'תעד את הפרטים: שולח, נושא, שעה, ומה עשית',
      'אל תמחק את ההודעה - היא עשויה לשמש לחקירה'
    ] : [
      'If you receive a suspicious message - do NOT click links or open attachments',
      'Forward the original message (as an attachment) to the IT team or designated security contact',
      'If you accidentally clicked - disconnect from the network immediately and notify IT',
      'Document the details: sender, subject, time, and what action you took',
      'Do NOT delete the message - it may be needed for investigation'
    ];
    paragraphs.push(...this.createBulletPoints(reportingPolicy));

    // Policy 3: Anti-Vishing Call Script
    paragraphs.push(this.createHeading2(this.translate('antiVishing')));
    const vishingScript = this.language === 'he' ? [
      'אם מתקשר מבקש מידע רגיש או פעולה דחופה - לעולם אל תמסור מיד',
      'בקש את שם המתקשר, ארגון, ומספר חזרה - ואמת באופן עצמאי',
      'לעולם אל תמסור סיסמאות, קודי אימות, או פרטי חשבון בנק בטלפון',
      'אם המתקשר לוחץ לפעולה מיידית - זה סימן אזהרה חזק. התעקש על אימות',
      'תעד שיחות חשודות ודווח לממונה ולצוות IT מיד'
    ] : [
      'If a caller requests sensitive information or urgent action - NEVER comply immediately',
      'Ask for the caller\'s name, organization, and callback number - then verify independently',
      'Never provide passwords, verification codes, or bank account details over the phone',
      'If the caller pressures for immediate action - this is a strong warning sign. Insist on verification',
      'Document suspicious calls and report to your manager and IT team immediately'
    ];
    paragraphs.push(...this.createBulletPoints(vishingScript));

    return paragraphs;
  }

  // ==================== Helper Methods ====================

  createPageBreak() {
    return new Paragraph({ children: [new PageBreak()] });
  }

  createHeading1(text) {
    return new Paragraph({
      children: [
        new TextRun({
          text: text.toUpperCase(),
          bold: true,
          size: 32,
          color: '1e3a5f'
        })
      ],
      spacing: { after: 200 }
    });
  }

  createHeading2(text) {
    return new Paragraph({
      children: [
        new TextRun({
          text: text,
          bold: true,
          size: 26,
          color: '333333'
        })
      ],
      spacing: { before: 200, after: 100 }
    });
  }

  createHeading3(text) {
    return new Paragraph({
      children: [
        new TextRun({
          text: text,
          bold: true,
          size: 22,
          color: '555555'
        })
      ],
      spacing: { before: 150, after: 50 }
    });
  }

  createBulletPoints(items) {
    return items.map(item =>
      new Paragraph({
        text: String(item),
        bullet: { level: 0 },
        spacing: { after: 80 }
      })
    );
  }

  createTableHeaderCell(text) {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: text, bold: true, color: 'FFFFFF', size: 20 })
          ]
        })
      ],
      shading: { fill: '1e3a5f' }
    });
  }

  createTableCell(text, bold = false) {
    return new TableCell({
      children: [
        new Paragraph({
          children: [
            new TextRun({ text: String(text), bold, size: 20 })
          ]
        })
      ]
    });
  }

  getPriorityColor(priority) {
    const colors = {
      'Critical': 'DC143C',
      'High': 'FF6347',
      'Medium': 'FFA500'
    };
    return colors[priority] || '000000';
  }

  getRiskColor(riskLevel) {
    const colors = {
      'critical': 'DC143C',
      'high': 'FF6347',
      'medium': 'FFA500',
      'low': '4CAF50'
    };
    return colors[riskLevel] || 'FFA500';
  }

  getEstimatedPages(documentType) {
    return documentType === 'summary' ? '5-8' : '15-25';
  }

  async getDocumentBuffer(doc) {
    try {
      return await Packer.toBuffer(doc);
    } catch (error) {
      throw new Error(`Failed to generate document buffer: ${error.message}`);
    }
  }
}

module.exports = new DocumentGenerator();
