const { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, BorderStyle, convertInchesToTwip, HeadingLevel, UnorderedList, ListItem, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');
const { t } = require('../locales/export-translations');

/**
 * Generates a customized business transformation program as a Word document
 * Based on user's business challenges and selected technologies
 */
class DocumentGenerator {
  constructor() {
    this.documentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    this.language = 'en'; // Default language
  }

  /**
   * Set the document language for translations
   * @param {string} lang - Language code (en, he, ru)
   */
  setLanguage(lang) {
    this.language = lang || 'en';
  }

  /**
   * Get translated text
   * @param {string} key - Translation key
   * @returns {string} - Translated text
   */
  translate(key) {
    return t(this.language, key);
  }

  /**
   * Generate complete business program document with variable length support
   * @param {Object} userAnalysis - User's business profile
   * @param {Array} recommendations - Technology recommendations
   * @param {string} documentType - 'summary' (5-10 pages), 'standard' (20-25 pages), 'comprehensive' (40-50 pages)
   * @param {string} language - Language code (en, he, ru)
   */
  async generateBusinessProgram(userAnalysis, recommendations, documentType = 'standard', language = 'en') {
    try {
      // Set language for translations
      this.setLanguage(language);

      const children = [];

      // Validate document type
      const validTypes = ['summary', 'standard', 'comprehensive'];
      const type = validTypes.includes(documentType) ? documentType : 'standard';

      // Cover page (all document types)
      children.push(...this.createCoverPage(userAnalysis));
      children.push(new PageBreak());

      // Executive Summary (all document types)
      children.push(...this.createExecutiveSummary(userAnalysis, recommendations));
      children.push(new PageBreak());

      // For summary type - skip to recommendations only
      if (type === 'summary') {
        children.push(...this.createTechnologyRecommendations(recommendations));
        // Action plan for quick reference
        children.push(new PageBreak());
        children.push(...this.createActionPlan(recommendations, userAnalysis));
      }

      // For standard and comprehensive - include diagnosis
      if (type === 'standard' || type === 'comprehensive') {
        children.push(...this.createDiagnosis(userAnalysis));
        children.push(new PageBreak());

        // Technology recommendations
        children.push(...this.createTechnologyRecommendations(recommendations));
        children.push(new PageBreak());

        // Implementation roadmap
        children.push(...this.createImplementationRoadmap(recommendations));
        children.push(new PageBreak());

        // Success metrics
        children.push(...this.createSuccessMetrics(userAnalysis));
        children.push(new PageBreak());

        // Action plan
        children.push(...this.createActionPlan(recommendations, userAnalysis));
      }

      // For comprehensive only - add additional sections
      if (type === 'comprehensive') {
        children.push(new PageBreak());
        children.push(...this.createDetailedComparisonMatrix(recommendations));
        children.push(new PageBreak());
        children.push(...this.createRiskMitigation(userAnalysis, recommendations));
        children.push(new PageBreak());
        children.push(...this.createChangeManagement(userAnalysis, recommendations));
        children.push(new PageBreak());
        children.push(...this.createCostBenefitAnalysis(recommendations));
      }

      // Footer with document info
      children.push(
        new Paragraph({
          text: `Generated: ${this.documentDate} | Document Type: ${type.toUpperCase()} | Pages: ${this.getEstimatedPages(type)}`,
          spacing: { before: 400 },
          alignment: AlignmentType.CENTER,
          italics: true,
          color: '666666',
          size: 18
        })
      );

      const doc = new Document({
        sections: [
          {
            children: children
          }
        ]
      });

      return doc;
    } catch (error) {
      throw new Error(`Failed to generate document: ${error.message}`);
    }
  }

  /**
   * Create cover page
   */
  createCoverPage(userAnalysis) {
    const paragraphs = [
      new Paragraph({
        text: this.translate('businessProgram').toUpperCase(),
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: userAnalysis.businessName || 'Your Business',
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        size: 28,
        bold: true
      }),
      new Paragraph({
        text: `${this.translate('businessType')}: ${userAnalysis.businessType}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),
      new Paragraph(''),
      new Paragraph(''),
      new Paragraph(''),
      new Paragraph({
        text: `${this.translate('generatedOn')}: ${this.documentDate}`,
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 },
        italics: true,
        color: '666666'
      })
    ];

    return paragraphs;
  }

  /**
   * Create executive summary
   */
  createExecutiveSummary(userAnalysis, recommendations) {
    const paragraphs = [
      new Paragraph({
        text: this.translate('executiveSummary').toUpperCase(),
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: this.translate('yourBusinessProfile'),
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: `Your ${userAnalysis.businessType} business is currently facing challenges in: ${userAnalysis.mainChallenge}. This program outlines a strategic approach to leverage modern technology to overcome these obstacles and drive growth.`,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Key Opportunities',
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 }
      }),
      ...this.createBulletPoints([
        `Implement 4 carefully selected technology solutions tailored to your business`,
        `Estimated improvement in your primary challenge area: 30-50% efficiency gain`,
        `Timeline: Phased implementation over ${userAnalysis.timeline} period`,
        `Budget level: ${userAnalysis.budget} tier solutions`,
        `Complexity: Suitable for ${userAnalysis.techLevel} technical expertise level`
      ]),
      new Paragraph({
        text: 'Expected Outcomes',
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100, before: 200 }
      }),
      ...this.createBulletPoints([
        'Streamlined business processes',
        'Improved customer experience',
        'Better data-driven decision making',
        'Scalability for future growth',
        'Competitive advantage in your market'
      ])
    ];

    return paragraphs;
  }

  /**
   * Create diagnosis section
   */
  createDiagnosis(userAnalysis) {
    const paragraphs = [
      new Paragraph({
        text: 'BUSINESS DIAGNOSIS',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Your Business Profile',
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 }
      })
    ];

    // Create diagnosis table
    const diagnosisRows = [
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph({ text: 'Category', bold: true })] }),
          new TableCell({ children: [new Paragraph({ text: 'Your Profile', bold: true })] })
        ]
      }),
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph('Business Type')] }),
          new TableCell({ children: [new Paragraph(userAnalysis.businessType)] })
        ]
      }),
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph('Main Challenge')] }),
          new TableCell({ children: [new Paragraph(userAnalysis.mainChallenge)] })
        ]
      }),
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph('Tech Level')] }),
          new TableCell({ children: [new Paragraph(userAnalysis.techLevel)] })
        ]
      }),
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph('Budget')] }),
          new TableCell({ children: [new Paragraph(userAnalysis.budget)] })
        ]
      }),
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph('Timeline')] }),
          new TableCell({ children: [new Paragraph(userAnalysis.timeline)] })
        ]
      }),
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph('Team Size')] }),
          new TableCell({ children: [new Paragraph(userAnalysis.teamSize)] })
        ]
      })
    ];

    paragraphs.push(
      new Table({
        rows: diagnosisRows,
        width: { size: 100, type: 'pct' }
      })
    );

    paragraphs.push(
      new Paragraph({
        text: 'Key Findings',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 }
      })
    );

    const findings = this.generateFindings(userAnalysis);
    paragraphs.push(...this.createBulletPoints(findings));

    return paragraphs;
  }

  /**
   * Generate specific findings based on business profile
   */
  generateFindings(userAnalysis) {
    const findings = [];

    // Challenge-specific findings
    const challengeFindings = {
      'customer-acquisition': 'Need for improved customer acquisition and retention strategies',
      'organization': 'Workflow optimization and team collaboration are critical',
      'payments': 'Payment processing and transaction security require attention',
      'online-presence': 'Strong online presence and digital channels are essential',
      'time-efficiency': 'Automation of repetitive tasks is a priority'
    };

    findings.push(challengeFindings[userAnalysis.mainChallenge] || 'Business process optimization needed');

    // Budget-based finding
    const budgetContext = {
      'free': 'Focus on high-value free solutions with optional premium features',
      'low': 'Cost-effective solutions that provide strong ROI',
      'medium': 'Mid-range tools that offer comprehensive feature sets',
      'high': 'Enterprise-grade solutions with advanced capabilities'
    };
    findings.push(budgetContext[userAnalysis.budget] || 'Balanced solution selection');

    // Timeline-based finding
    const timelineContext = {
      'immediate': 'Quick implementation is critical for competitive advantage',
      'short': 'Phased rollout within weeks is recommended',
      'medium': 'Structured implementation over months allows proper training',
      'long': 'Extended timeline permits comprehensive customization'
    };
    findings.push(timelineContext[userAnalysis.timeline] || 'Structured implementation planned');

    // Team size consideration
    const teamContext = {
      'solo': 'Automation and ease-of-use are paramount for solo operation',
      'small': 'Solutions should support small team collaboration',
      'medium': 'Scalable platforms that can grow with team',
      'large': 'Enterprise features with multi-user support'
    };
    findings.push(teamContext[userAnalysis.teamSize] || 'Team scaling considerations');

    return findings;
  }

  /**
   * Create technology recommendations section
   */
  createTechnologyRecommendations(recommendations) {
    const paragraphs = [
      new Paragraph({
        text: 'RECOMMENDED TECHNOLOGIES',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: 'The following 4 solutions have been selected specifically for your business needs:',
        spacing: { after: 300 }
      })
    ];

    recommendations.forEach((tech, index) => {
      paragraphs.push(
        new Paragraph({
          text: `${index + 1}. ${tech.name}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: `Priority: ${tech.priority || 'Critical'}`,
          spacing: { after: 100 },
          bold: true,
          color: this.getPriorityColor(tech.priority)
        })
      );

      // Description
      paragraphs.push(
        new Paragraph({
          text: tech.description || 'Professional business solution',
          spacing: { after: 150 }
        })
      );

      // Features (handle both field names)
      const factors = tech.matchingFactors || tech.factors || [];
      if (factors && factors.length > 0) {
        paragraphs.push(
          new Paragraph({
            text: 'Why This Solution:',
            heading: HeadingLevel.HEADING_3,
            spacing: { after: 100 }
          })
        );
        paragraphs.push(...this.createBulletPoints(factors));
      }

      // Implementation details (handle both field name formats)
      const complexity = tech.implementationDetails?.complexity || tech.complexity || 'Moderate';
      const setupTime = tech.implementationDetails?.setupTime || tech.setup || 'Quick';

      if (complexity || setupTime) {
        paragraphs.push(
          new Paragraph({
            text: 'Implementation:',
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 150, after: 100 }
          }),
          new Paragraph({
            text: `Complexity: ${complexity} | Setup Time: ${setupTime}`,
            spacing: { after: 100 },
            italics: true
          })
        );
      }

      // Pricing (if available)
      if (tech.pricing) {
        paragraphs.push(
          new Paragraph({
            text: `Pricing: ${tech.pricing}`,
            spacing: { after: 200 },
            italics: true,
            color: '0070C0'
          })
        );
      }

      // Call to action (handle both field names)
      const link = tech.website || tech.officialLink || tech.link;
      if (link) {
        paragraphs.push(
          new Paragraph({
            text: `Learn More: ${link}`,
            spacing: { after: 100 },
            italics: true,
            color: '0070C0'
          })
        );
      }
    });

    return paragraphs;
  }

  /**
   * Create implementation roadmap
   */
  createImplementationRoadmap(recommendations) {
    const paragraphs = [
      new Paragraph({
        text: 'IMPLEMENTATION ROADMAP',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Phase-by-Phase Implementation Plan',
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 }
      })
    ];

    const phases = [
      {
        name: 'Phase 1: Planning & Setup',
        duration: 'Week 1-2',
        tasks: [
          'Define specific objectives for each technology',
          'Assign team members to lead each implementation',
          'Create accounts and secure licenses',
          'Review documentation and best practices'
        ]
      },
      {
        name: 'Phase 2: Initial Implementation',
        duration: 'Week 3-4',
        tasks: [
          'Set up core features and configurations',
          'Import or migrate existing data',
          'Create user accounts and permissions',
          'Conduct initial staff training'
        ]
      },
      {
        name: 'Phase 3: Integration & Optimization',
        duration: 'Week 5-8',
        tasks: [
          'Connect tools together for seamless workflow',
          'Optimize settings based on real-world usage',
          'Provide advanced training to power users',
          'Gather feedback and make adjustments'
        ]
      },
      {
        name: 'Phase 4: Full Rollout & Monitoring',
        duration: 'Week 9+',
        tasks: [
          'Deploy across entire organization',
          'Monitor performance and usage metrics',
          'Provide ongoing support and training',
          'Plan for future enhancements'
        ]
      }
    ];

    phases.forEach(phase => {
      paragraphs.push(
        new Paragraph({
          text: phase.name,
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 150, after: 50 }
        }),
        new Paragraph({
          text: `Duration: ${phase.duration}`,
          spacing: { after: 100 },
          italics: true,
          color: '666666'
        })
      );
      paragraphs.push(...this.createBulletPoints(phase.tasks));
    });

    return paragraphs;
  }

  /**
   * Create success metrics section
   */
  createSuccessMetrics(userAnalysis) {
    const paragraphs = [
      new Paragraph({
        text: 'SUCCESS METRICS & KPIs',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Track Your Transformation Progress',
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: 'The following metrics will help you measure the success of this technology implementation:',
        spacing: { after: 200 }
      })
    ];

    // Create metrics table
    const metricsRows = [
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph({ text: 'Metric', bold: true })] }),
          new TableCell({ children: [new Paragraph({ text: 'Baseline', bold: true })] }),
          new TableCell({ children: [new Paragraph({ text: 'Target (3 months)', bold: true })] })
        ]
      }),
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph('Time Spent on Manual Tasks')] }),
          new TableCell({ children: [new Paragraph('100%')] }),
          new TableCell({ children: [new Paragraph('60-70%')] })
        ]
      }),
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph('Customer Response Time')] }),
          new TableCell({ children: [new Paragraph('Current baseline')] }),
          new TableCell({ children: [new Paragraph('Reduce by 50%')] })
        ]
      }),
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph('Data Accuracy')] }),
          new TableCell({ children: [new Paragraph('Current %')] }),
          new TableCell({ children: [new Paragraph('Improve by 20%')] })
        ]
      }),
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph('Team Productivity')] }),
          new TableCell({ children: [new Paragraph('Baseline')] }),
          new TableCell({ children: [new Paragraph('Increase by 25-30%')] })
        ]
      }),
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph('System Adoption Rate')] }),
          new TableCell({ children: [new Paragraph('0%')] }),
          new TableCell({ children: [new Paragraph('80%+ team usage')] })
        ]
      })
    ];

    paragraphs.push(
      new Table({
        rows: metricsRows,
        width: { size: 100, type: 'pct' }
      })
    );

    paragraphs.push(
      new Paragraph({
        text: 'Review & Adjust Strategy',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 }
      })
    );

    paragraphs.push(...this.createBulletPoints([
      'Monthly progress reviews to assess adoption and impact',
      'Quarterly strategy adjustments based on actual results',
      'Semi-annual ROI analysis to justify continued investment',
      'Ongoing staff feedback collection for continuous improvement'
    ]));

    return paragraphs;
  }

  /**
   * Create action plan section
   */
  createActionPlan(recommendations, userAnalysis) {
    const paragraphs = [
      new Paragraph({
        text: 'YOUR ACTION PLAN',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: 'Immediate Next Steps (This Week)',
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 }
      })
    ];

    const immediateActions = [
      'Review this complete business program with your team',
      'Designate a project champion to lead implementation',
      'Schedule a team meeting to discuss the roadmap',
      'Create accounts with the 4 recommended platforms',
      'Identify quick wins to build momentum'
    ];

    paragraphs.push(...this.createBulletPoints(immediateActions));

    paragraphs.push(
      new Paragraph({
        text: 'Week 1-2: Planning Phase',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    );

    const planningPhase = [
      'Define specific business objectives for each tool',
      'Assign team members to lead implementation',
      'Gather team feedback on tool selection',
      'Plan data migration strategy (if applicable)',
      'Create detailed implementation timeline'
    ];

    paragraphs.push(...this.createBulletPoints(planningPhase));

    paragraphs.push(
      new Paragraph({
        text: 'Resources & Support',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    );

    const resources = [
      'Each platform provides free trials - test before full rollout',
      'Most vendors offer onboarding support and training resources',
      'YouTube tutorials and community forums for each tool',
      'Schedule vendor demos to fully understand capabilities',
      'Consider hiring a consultant if overwhelmed by complexity'
    ];

    paragraphs.push(...this.createBulletPoints(resources));

    paragraphs.push(
      new Paragraph({
        text: 'Critical Success Factors',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    );

    const successFactors = [
      'Executive support and commitment to change',
      'Clear communication of benefits to all team members',
      'Comprehensive training and ongoing support',
      'Patience - allow 30-60 days for full adoption',
      'Regular monitoring and course correction',
      'Celebration of wins to maintain momentum'
    ];

    paragraphs.push(...this.createBulletPoints(successFactors));

    paragraphs.push(
      new Paragraph({
        text: 'Handling Resistance & Challenges',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      })
    );

    paragraphs.push(
      new Paragraph({
        text: 'Change is challenging, but these strategies will help:',
        spacing: { after: 100 }
      })
    );

    const changeStrategies = [
      'Involve team members in tool selection and training design',
      'Start with power users who can become advocates',
      'Celebrate early successes and share results',
      'Provide personalized support for struggling team members',
      'Keep the focus on benefits, not just features',
      'Allow time for adjustment - expect 30-60 day learning curve'
    ];

    paragraphs.push(...this.createBulletPoints(changeStrategies));

    // Closing
    paragraphs.push(
      new Paragraph({
        text: 'Final Notes',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        text: 'This business transformation program is customized specifically for your organization\'s needs and challenges. By following this roadmap and implementing these technologies strategically, you\'ll position your business for sustainable growth and competitive advantage. Remember: the technology is a tool - success depends on your team\'s commitment and adoption.',
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: '✓ You have everything you need to succeed. Start today!',
        spacing: { before: 200 },
        bold: true,
        alignment: AlignmentType.CENTER
      })
    );

    return paragraphs;
  }

  /**
   * Helper: Create bullet point list
   */
  createBulletPoints(items) {
    return items.map(item =>
      new Paragraph({
        text: item,
        bullet: { level: 0 },
        spacing: { after: 100 }
      })
    );
  }

  /**
   * Create detailed comparison matrix (comprehensive only)
   */
  createDetailedComparisonMatrix(recommendations) {
    const paragraphs = [
      new Paragraph({
        text: 'DETAILED TECHNOLOGY COMPARISON',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: 'How the recommended solutions compare across key dimensions:',
        spacing: { after: 200 }
      })
    ];

    // Create comprehensive comparison table
    const headers = ['Feature', ...recommendations.slice(0, 4).map(r => r.name || 'Solution')];
    const comparisonRows = [
      new TableRow({
        cells: headers.map(h => new TableCell({ children: [new Paragraph({ text: h, bold: true })] }))
      }),
      // Pricing row
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph({ text: 'Pricing', bold: true })] }),
          ...recommendations.slice(0, 4).map(r => new TableCell({ children: [new Paragraph(r.pricing || 'Contact vendor')] }))
        ]
      }),
      // Complexity row
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph({ text: 'Complexity', bold: true })] }),
          ...recommendations.slice(0, 4).map(r => new TableCell({ children: [new Paragraph(r.complexity || 'Moderate')] }))
        ]
      }),
      // Setup time row
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph({ text: 'Setup Time', bold: true })] }),
          ...recommendations.slice(0, 4).map(r => new TableCell({ children: [new Paragraph(r.setup || 'Quick')] }))
        ]
      }),
      // Priority row
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph({ text: 'Priority', bold: true })] }),
          ...recommendations.slice(0, 4).map(r => new TableCell({ children: [new Paragraph(r.priority || 'Medium')] }))
        ]
      })
    ];

    paragraphs.push(
      new Table({
        rows: comparisonRows,
        width: { size: 100, type: 'pct' }
      })
    );

    return paragraphs;
  }

  /**
   * Create risk mitigation section (comprehensive only)
   */
  createRiskMitigation(userAnalysis, recommendations) {
    const paragraphs = [
      new Paragraph({
        text: 'RISK MITIGATION STRATEGY',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Potential Challenges & Solutions',
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 }
      })
    ];

    const risks = [
      {
        risk: 'Staff Resistance to Change',
        mitigation: 'Involve team members early in selection, provide comprehensive training, celebrate wins'
      },
      {
        risk: 'Data Migration Complexity',
        mitigation: 'Plan migration thoroughly, test with sample data, consider phased approach'
      },
      {
        risk: 'Integration Challenges Between Tools',
        mitigation: 'Map data flows, use APIs and webhooks, engage vendor support early'
      },
      {
        risk: 'Budget Overruns',
        mitigation: 'Use free trials before full rollout, negotiate volume discounts, plan for contingency'
      },
      {
        risk: 'Implementation Delays',
        mitigation: 'Assign dedicated project champion, set realistic timelines, monitor progress weekly'
      },
      {
        risk: 'Low Adoption Rates',
        mitigation: 'Start with power users, provide continuous support, demonstrate clear ROI'
      }
    ];

    risks.forEach(item => {
      paragraphs.push(
        new Paragraph({
          text: item.risk,
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 100, after: 50 }
        }),
        new Paragraph({
          text: `Mitigation: ${item.mitigation}`,
          spacing: { after: 100 },
          indent: { left: 720 }
        })
      );
    });

    return paragraphs;
  }

  /**
   * Create change management section (comprehensive only)
   */
  createChangeManagement(userAnalysis, recommendations) {
    const paragraphs = [
      new Paragraph({
        text: 'CHANGE MANAGEMENT FRAMEWORK',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Step-by-Step Change Implementation',
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 }
      })
    ];

    const phases = [
      {
        phase: 'AWARENESS (Week 1)',
        actions: [
          'Announce the technology initiative and its benefits',
          'Share the business case and expected outcomes',
          'Address concerns and answer questions',
          'Highlight how it solves current pain points'
        ]
      },
      {
        phase: 'ACCEPTANCE (Weeks 2-3)',
        actions: [
          'Provide hands-on demonstrations',
          'Allow staff to experiment with free trials',
          'Share success stories from similar organizations',
          'Build internal champions who can advocate for the tools'
        ]
      },
      {
        phase: 'ADOPTION (Weeks 4-8)',
        actions: [
          'Roll out formal training programs',
          'Implement peer mentoring for struggling users',
          'Create quick reference guides and FAQs',
          'Monitor adoption metrics and adjust as needed'
        ]
      },
      {
        phase: 'PROFICIENCY (Weeks 9+)',
        actions: [
          'Move to advanced training for power users',
          'Optimize workflows based on real usage',
          'Integrate with other business processes',
          'Plan continuous improvement initiatives'
        ]
      }
    ];

    phases.forEach(item => {
      paragraphs.push(
        new Paragraph({
          text: item.phase,
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 150, after: 100 }
        })
      );
      paragraphs.push(...this.createBulletPoints(item.actions));
    });

    return paragraphs;
  }

  /**
   * Create cost-benefit analysis (comprehensive only)
   */
  createCostBenefitAnalysis(recommendations) {
    const paragraphs = [
      new Paragraph({
        text: 'COST-BENEFIT ANALYSIS',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: 'Financial Impact Projection',
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 100 }
      })
    ];

    // Estimate costs
    const costs = [
      { item: 'Software Licenses (Annual)', estimate: 'Based on selected pricing tiers' },
      { item: 'Implementation & Setup', estimate: 'Typically 50-100 hours of consulting' },
      { item: 'Training & Support', estimate: 'Estimated 20-30 hours per team member' },
      { item: 'Data Migration', estimate: 'Varies by complexity of existing systems' }
    ];

    paragraphs.push(
      new Paragraph({
        text: 'Estimated Costs',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 100, after: 100 }
      })
    );

    const costRows = [
      new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph({ text: 'Cost Item', bold: true })] }),
          new TableCell({ children: [new Paragraph({ text: 'Estimate', bold: true })] })
        ]
      }),
      ...costs.map(c => new TableRow({
        cells: [
          new TableCell({ children: [new Paragraph(c.item)] }),
          new TableCell({ children: [new Paragraph(c.estimate)] })
        ]
      }))
    ];

    paragraphs.push(
      new Table({
        rows: costRows,
        width: { size: 100, type: 'pct' }
      })
    );

    // Expected benefits
    paragraphs.push(
      new Paragraph({
        text: 'Expected Benefits',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 }
      })
    );

    const benefits = [
      '30-50% reduction in manual task time (ROI in 6-12 months)',
      'Improved data accuracy and decision-making speed',
      'Better customer satisfaction through faster response times',
      'Scalability to support business growth',
      'Reduced operational risks and compliance issues',
      'Competitive advantage in your market'
    ];

    paragraphs.push(...this.createBulletPoints(benefits));

    paragraphs.push(
      new Paragraph({
        text: 'Payback Period',
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        text: 'For most organizations, the time savings and efficiency gains from these tools produce measurable ROI within 6-12 months. The longer-term benefits (competitive advantage, growth enablement) compound over years.',
        spacing: { after: 100 }
      })
    );

    return paragraphs;
  }

  /**
   * Get estimated page count for document type
   */
  getEstimatedPages(documentType) {
    const pageEstimates = {
      'summary': '5-10',
      'standard': '20-25',
      'comprehensive': '40-50'
    };
    return pageEstimates[documentType] || '15-20';
  }

  /**
   * Helper: Get priority color
   */
  getPriorityColor(priority) {
    const colors = {
      'Critical': 'DC143C',
      'High': 'FF6347',
      'Medium': 'FFA500',
      'Useful': '4CAF50'
    };
    return colors[priority] || '000000';
  }

  /**
   * Save document to file
   */
  async saveDocument(doc, businessName) {
    try {
      const fileName = `Business_Transformation_Program_${businessName.replace(/\s+/g, '_')}_${Date.now()}.docx`;
      const filePath = path.join(__dirname, '../generated-documents', fileName);

      // Ensure directory exists
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const buffer = await Packer.toBuffer(doc);
      fs.writeFileSync(filePath, buffer);

      return {
        fileName,
        filePath,
        size: buffer.length
      };
    } catch (error) {
      throw new Error(`Failed to save document: ${error.message}`);
    }
  }

  /**
   * Convert document to buffer for streaming download
   */
  async getDocumentBuffer(doc) {
    try {
      return await Packer.toBuffer(doc);
    } catch (error) {
      throw new Error(`Failed to generate document buffer: ${error.message}`);
    }
  }
}

module.exports = new DocumentGenerator();
