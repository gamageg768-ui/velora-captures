import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const ink = '#0f172a';
const accent = '#0ea5e9';
const muted = '#64748b';
const line = '#e2e8f0';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    paddingTop: 72,
    paddingBottom: 72,
    paddingHorizontal: 64,
    color: ink,
  },
  // Header
  header: {
    marginBottom: 32,
  },
  brandName: {
    fontSize: 36,
    fontFamily: 'Helvetica-Bold',
    color: ink,
    letterSpacing: 6,
  },
  tagline: {
    fontSize: 11,
    color: muted,
    letterSpacing: 2,
    marginTop: 4,
  },
  // Divider
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: line,
    marginVertical: 24,
  },
  // Eyebrow / small label
  eyebrow: {
    fontSize: 9,
    color: accent,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  // Proposal heading
  proposalHeading: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: ink,
    marginBottom: 24,
  },
  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: ink,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: line,
  },
  bodyText: {
    fontSize: 11,
    color: ink,
    lineHeight: 1.7,
  },
  // Timeline items
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  timelinePhase: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: ink,
    width: 160,
  },
  timelineDuration: {
    fontSize: 11,
    color: muted,
  },
  // Next steps list
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bullet: {
    fontSize: 11,
    color: accent,
    width: 16,
  },
  listText: {
    fontSize: 11,
    color: ink,
    flex: 1,
    lineHeight: 1.6,
  },
  // Footer
  footer: {
    marginTop: 40,
    borderTopWidth: 1,
    borderTopColor: line,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 9,
    color: muted,
    letterSpacing: 1,
  },
  // Accent bar
  accentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: accent,
  },
});

type ProposalProps = {
  inquiry: {
    name: string;
    email: string;
    subject: string | null;
    budget: string | null;
    message: string;
    createdAt: Date;
  };
};

export default function ProposalDocument({ inquiry }: ProposalProps) {
  const formattedDate = new Date(inquiry.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const projectTitle = inquiry.subject ?? 'Custom Project';

  return (
    <Document title={`Proposal — ${inquiry.name}`} author="OBSCURA">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandName}>OBSCURA</Text>
          <Text style={styles.tagline}>Design × Photography</Text>
        </View>

        {/* Hairline divider */}
        <View style={styles.divider} />

        {/* Proposal title block */}
        <Text style={styles.eyebrow}>Project Proposal</Text>
        <Text style={styles.proposalHeading}>{inquiry.name}</Text>

        {/* Project Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Overview</Text>
          <Text style={styles.bodyText}>
            {projectTitle}
            {'\n\n'}
            {inquiry.message}
          </Text>
        </View>

        {/* Budget */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget</Text>
          <Text style={styles.bodyText}>
            {inquiry.budget
              ? `Estimated investment: ${inquiry.budget}`
              : 'Budget to be discussed based on final project scope.'}
          </Text>
        </View>

        {/* Proposed Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proposed Timeline</Text>
          <View style={styles.timelineRow}>
            <Text style={styles.timelinePhase}>Discovery & Research</Text>
            <Text style={styles.timelineDuration}>2 weeks</Text>
          </View>
          <View style={styles.timelineRow}>
            <Text style={styles.timelinePhase}>Design & Development</Text>
            <Text style={styles.timelineDuration}>4 weeks</Text>
          </View>
          <View style={styles.timelineRow}>
            <Text style={styles.timelinePhase}>Delivery & Handoff</Text>
            <Text style={styles.timelineDuration}>2 weeks</Text>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Next Steps</Text>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>→</Text>
            <Text style={styles.listText}>Review this proposal and confirm project scope.</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>→</Text>
            <Text style={styles.listText}>Sign the project agreement to formalise our engagement.</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>→</Text>
            <Text style={styles.listText}>Submit the 50% deposit to reserve your project slot.</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>→</Text>
            <Text style={styles.listText}>
              Reply to {inquiry.email} to proceed or discuss any adjustments.
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>OBSCURA · obscura.studio</Text>
          <Text style={styles.footerText}>{formattedDate}</Text>
        </View>

        {/* Accent bar */}
        <View style={styles.accentBar} />
      </Page>
    </Document>
  );
}
