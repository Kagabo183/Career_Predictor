// App.tsx

import React, {useState, useCallback, memo} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import strings from './src/strings';

// --- Type Definitions ---
type EducationLevel = 'bachelor' | 'master' | 'diploma' | 'high school';

interface CareerOption {
  skills: string[];
  interests: string[];
  education: EducationLevel;
  career: string;
}

// --- 1. The Dataset ---
const careerData: CareerOption[] = [
  {
    skills: ['python', 'excel', 'sql'],
    interests: ['technology', 'finance'],
    education: 'bachelor',
    career: 'Data Analyst',
  },
  {
    skills: ['python', 'r', 'statistics'],
    interests: ['technology', 'science'],
    education: 'master',
    career: 'Data Scientist',
  },
  {
    skills: ['java', 'react', 'sql'],
    interests: ['technology'],
    education: 'bachelor',
    career: 'Software Developer',
  },
  {
    skills: ['communication', 'marketing'],
    interests: ['business'],
    education: 'diploma',
    career: 'Marketing Officer',
  },
  {
    skills: ['excel', 'accounting'],
    interests: ['finance'],
    education: 'bachelor',
    career: 'Accountant',
  },
  {
    skills: ['biology', 'lab work'],
    interests: ['health'],
    education: 'bachelor',
    career: 'Laboratory Scientist',
  },
  {
    skills: ['teaching', 'writing'],
    interests: ['education'],
    education: 'bachelor',
    career: 'Teacher',
  },
  {
    skills: ['graphic design', 'creativity'],
    interests: ['art'],
    education: 'diploma',
    career: 'Graphic Designer',
  },
  {
    skills: ['sales', 'communication'],
    interests: ['business'],
    education: 'high school',
    career: 'Sales Representative',
  },
  {
    skills: ['project management', 'leadership'],
    interests: ['business'],
    education: 'bachelor',
    career: 'Project Manager',
  },
];

// --- Reusable Tag Component for displaying selected items ---
const SelectedItemTag: React.FC<{item: string}> = memo(({item}) => (
  <View style={styles.selectedTag}>
    <Text style={styles.selectedTagText}>{item}</Text>
  </View>
));

// --- 2. The "Prediction" Logic ---
const predictCareer = (
  userSkills: string[],
  userInterests: string[],
  userEducation: EducationLevel | null,
) => {
  const bestMatch = careerData.reduce(
    (match, option) => {
      const skillScore =
        userSkills.filter(s => option.skills.includes(s)).length * 3;
      const interestScore =
        userInterests.filter(i => option.interests.includes(i)).length * 2;
      const educationScore = userEducation === option.education ? 1 : 0;
      const totalScore = skillScore + interestScore + educationScore;

      return totalScore > match.score
        ? {career: option.career, score: totalScore}
        : match;
    },
    {career: strings.notFound, score: 0},
  );

  return bestMatch.score > 0 ? bestMatch.career : strings.noSuitableCareer;
};

const allSkills = [...new Set(careerData.flatMap(c => c.skills))].sort();
const allInterests = [...new Set(careerData.flatMap(c => c.interests))].sort();
const allEducationLevels: EducationLevel[] = [
  'high school',
  'diploma',
  'bachelor',
  'master',
];

// --- 3. The Main App Component (The UI) ---
function App(): React.JSX.Element {
  // State for selections
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedEducation, setSelectedEducation] =
    useState<EducationLevel | null>(null);
  const [predictedCareer, setPredictedCareer] = useState('');

  // State for dropdown visibility
  const [skillsDropdownVisible, setSkillsDropdownVisible] = useState(false);
  const [interestsDropdownVisible, setInterestsDropdownVisible] =
    useState(false);
  const [educationDropdownVisible, setEducationDropdownVisible] =
    useState(false);

  const handleSkillToggle = useCallback((skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill],
    );
  }, []);

  const handleInterestToggle = useCallback((interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest],
    );
  }, []);

  const handleEducationSelect = useCallback((education: EducationLevel) => {
    setSelectedEducation(prev => (prev === education ? null : education));
    setEducationDropdownVisible(false); // Auto-close on selection
  }, []);

  const handlePredict = () => {
    if (selectedSkills.length === 0) {
      Alert.alert(strings.missingInformation, strings.selectAtLeastOneSkill);
      return;
    }
    const result = predictCareer(
      selectedSkills,
      selectedInterests,
      selectedEducation,
    );
    setPredictedCareer(result);
  };

  const handleClear = () => {
    setSelectedSkills([]);
    setSelectedInterests([]);
    setSelectedEducation(null);
    setPredictedCareer('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image
            source={require('./assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>{strings.careerPathPredictor}</Text>
        </View>

        {/* --- Skills Dropdown --- */}
        <View style={styles.card}>
          <Text style={styles.label}>{strings.yourSkills}</Text>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() => setSkillsDropdownVisible(!skillsDropdownVisible)}>
            <View style={styles.tagContainer}>
              {selectedSkills.length > 0 ? (
                selectedSkills.map(skill => (
                  <SelectedItemTag key={skill} item={skill} />
                ))
              ) : (
                <Text style={styles.placeholderText}>Select your skills</Text>
              )}
            </View>
            <Text style={styles.chevron}>
              {skillsDropdownVisible ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          {skillsDropdownVisible && (
            <View style={styles.dropdownList}>
              {allSkills.map(skill => (
                <TouchableOpacity
                  key={skill}
                  style={styles.dropdownItem}
                  onPress={() => handleSkillToggle(skill)}>
                  <Text style={styles.dropdownItemText}>
                    {selectedSkills.includes(skill) ? '[✓] ' : '[ ] '}
                    {skill}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* --- Interests Dropdown --- */}
        <View style={styles.card}>
          <Text style={styles.label}>{strings.yourInterests}</Text>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() =>
              setInterestsDropdownVisible(!interestsDropdownVisible)
            }>
            <View style={styles.tagContainer}>
              {selectedInterests.length > 0 ? (
                selectedInterests.map(interest => (
                  <SelectedItemTag key={interest} item={interest} />
                ))
              ) : (
                <Text style={styles.placeholderText}>
                  Select your interests
                </Text>
              )}
            </View>
            <Text style={styles.chevron}>
              {interestsDropdownVisible ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          {interestsDropdownVisible && (
            <View style={styles.dropdownList}>
              {allInterests.map(interest => (
                <TouchableOpacity
                  key={interest}
                  style={styles.dropdownItem}
                  onPress={() => handleInterestToggle(interest)}>
                  <Text style={styles.dropdownItemText}>
                    {selectedInterests.includes(interest) ? '[✓] ' : '[ ] '}
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* --- Education Dropdown --- */}
        <View style={styles.card}>
          <Text style={styles.label}>{strings.yourEducation}</Text>
          <TouchableOpacity
            style={styles.dropdownHeader}
            onPress={() =>
              setEducationDropdownVisible(!educationDropdownVisible)
            }>
            <Text style={styles.placeholderText}>
              {selectedEducation || 'Select education level'}
            </Text>
            <Text style={styles.chevron}>
              {educationDropdownVisible ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>
          {educationDropdownVisible && (
            <View style={styles.dropdownList}>
              {allEducationLevels.map(level => (
                <TouchableOpacity
                  key={level}
                  style={styles.dropdownItem}
                  onPress={() => handleEducationSelect(level)}>
                  <Text
                    style={[
                      styles.dropdownItemText,
                      selectedEducation === level && styles.selectedText,
                    ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {predictedCareer ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>{strings.suggestedCareer}</Text>
            <Text style={styles.resultText}>{predictedCareer}</Text>
          </View>
        ) : null}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>
              {strings.clearSelections}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.predictButton}
            onPress={handlePredict}>
            <Text style={styles.predictButtonText}>
              {strings.predictMyCareer}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- 4. Styling ---
const PALETTE = {
  primary: '#008080', // Teal
  primaryLight: '#B2DFDB',
  background: '#F0F4F8',
  textPrimary: '#2C3E50',
  textSecondary: '#FFFFFF',
  grey: '#9E9E9E',
  lightGrey: '#F5F5F5',
  white: '#FFFFFF',
  border: '#E0E0E0',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PALETTE.background,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: PALETTE.textPrimary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: PALETTE.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: PALETTE.textPrimary,
    marginBottom: 10,
  },
  // --- Dropdown Styles ---
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PALETTE.lightGrey,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  placeholderText: {
    color: PALETTE.textPrimary,
    fontSize: 16,
  },
  chevron: {
    fontSize: 16,
    color: PALETTE.grey,
  },
  dropdownList: {
    marginTop: 10,
    backgroundColor: PALETTE.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.border,
  },
  dropdownItemText: {
    fontSize: 16,
    color: PALETTE.textPrimary,
    textTransform: 'capitalize',
  },
  selectedText: {
    color: PALETTE.primary,
    fontWeight: 'bold',
  },
  // --- Tag Styles ---
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    marginRight: 10,
  },
  selectedTag: {
    backgroundColor: PALETTE.primary,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 3,
  },
  selectedTagText: {
    color: PALETTE.white,
    fontWeight: '500',
    fontSize: 14,
  },
  // --- Button & Result Styles ---
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  predictButton: {
    backgroundColor: PALETTE.primary,
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  predictButtonText: {
    color: PALETTE.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearButton: {
    backgroundColor: PALETTE.white,
    paddingVertical: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.grey,
  },
  clearButtonText: {
    color: PALETTE.grey,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 10,
    padding: 20,
    backgroundColor: PALETTE.primaryLight,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: PALETTE.textPrimary,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PALETTE.primary,
    marginTop: 8,
  },
});

export default App;
