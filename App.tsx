// App.tsx

import React, {useState, useCallback, memo} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';

// --- Type Definitions ---
type EducationLevel = 'bachelor' | 'master' | 'diploma' | 'high school';

interface CareerOption {
  skills: string[];
  interests: string[];
  education: EducationLevel;
  career: string;
}

// --- 1. The Dataset ---
// We've converted your table into a JavaScript array of objects.
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

// --- Reusable Tag Component ---
interface TagProps {
  item: string;
  isSelected: boolean;
  onPress: () => void;
}

const Tag: React.FC<TagProps> = memo(({item, isSelected, onPress}) => (
  <TouchableOpacity style={[styles.tag, isSelected && styles.tagSelected]} onPress={onPress}>
    <Text style={[styles.tagText, isSelected && styles.tagTextSelected]}>
      {item}
    </Text>
  </TouchableOpacity>
));

// --- 2. The "Prediction" Logic ---
// This function mimics an ML model by calculating a "match score".
const predictCareer = (userSkills: string[]) => {
  // Using reduce for a more functional approach to finding the best match
  const bestMatch = careerData.reduce(
    (match, option) => {
      let score = 0;
      // Score is based on the number of matching skills
      score += userSkills.filter(s => option.skills.includes(s)).length;

      return score > match.score ? {career: option.career, score} : match;
    },
    { career: 'Not found', score: 0 },
  );

  return bestMatch.score > 0
    ? bestMatch.career
    : 'No suitable career found. Please try different selections.';
};

// Extract unique values from the dataset to populate our selection components
const allSkills = [...new Set(careerData.flatMap(c => c.skills))].sort();

// --- 3. The Main App Component (The UI) ---
function App(): React.JSX.Element {
  // 'useState' is a hook to manage the component's state (the data that can change)
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [predictedCareer, setPredictedCareer] = useState('');

  // Memoized toggle functions to prevent unnecessary re-renders of Tag components
  const handleSkillToggle = useCallback((skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  }, []);

  const handlePredict = () => {
    if (selectedSkills.length === 0) {
      Alert.alert('Missing Information', 'Please select at least one skill.');
      return;
    }
    const result = predictCareer(selectedSkills);
    setPredictedCareer(result);
  };

  const handleClear = () => {
    setSelectedSkills([]);
    setPredictedCareer('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={require('./assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Career Path Predictor</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Your Skills</Text>
          <View style={styles.tagContainer}>
            {allSkills.map(skill => (
              <Tag
                key={skill}
                item={skill}
                isSelected={selectedSkills.includes(skill)}
                onPress={() => handleSkillToggle(skill)}
              />
            ))}
          </View>

        </View>

        <View style={styles.buttonContainer}>
          <Button title="Clear Selections" onPress={handleClear} color="#888" />
          <Button title="Predict My Career" onPress={handlePredict} />
        </View>

        {/* This section only shows up after a prediction is made */}
        {predictedCareer ? (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Suggested Career:</Text>
            <Text style={styles.resultText}>{predictedCareer}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- 4. Styling ---
// This is like CSS for your mobile app.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 5,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  tag: {
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
  },
  tagSelected: {
    backgroundColor: '#1E88E5',
  },
  tagText: {
    color: '#333',
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#FFFFFF',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  resultContainer: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 18,
    color: '#1E88E5',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
    marginTop: 5,
  },
});

export default App;
