import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Modal,
} from 'react-native';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';

const FileFolderScreen: React.FC = () => {
  const [folderName, setFolderName] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileContent, setFileContent] = useState<string>('');
  const [files, setFiles] = useState<string[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const basePath = RNFS.DocumentDirectoryPath;

  const loadFilesAndFolders = async () => {
    try {
      const items = await RNFS.readDir(basePath);
      const folderItems = items.filter(item => item.isDirectory());
      const fileItems = items.filter(item => item.isFile());
      setFolders(folderItems.map(folder => folder.name));
      setFiles(fileItems.map(file => file.name));
    } catch (error) {
      console.error('Error loading files and folders:', error);
      Alert.alert('Error', 'Failed to load files and folders.');
    }
  };

  const createFolder = async () => {
    if (!folderName.trim()) {
      Alert.alert('Error', 'Folder name is required.');
      return;
    }
    try {
      const folderPath = `${basePath}/${folderName}`;
      await RNFS.mkdir(folderPath);
      setFolderName('');
      loadFilesAndFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
      Alert.alert('Error', 'Failed to create folder.');
    }
  };

  const createFile = async () => {
    if (!fileName.trim() || !fileContent.trim()) {
      Alert.alert('Error', 'File name and content are required.');
      return;
    }
    try {
      const filePath = `${basePath}/${fileName}.txt`;
      await RNFS.writeFile(filePath, fileContent, 'utf8');
      setFileName('');
      setFileContent('');
      loadFilesAndFolders();
    } catch (error) {
      console.error('Error creating file:', error);
      Alert.alert('Error', 'Failed to create file.');
    }
  };

  const readFile = async (file: string) => {
    try {
      const filePath = `${basePath}/${file}`;
      const content = await RNFS.readFile(filePath, 'utf8');
      if (content.trim()) {
        setSelectedFile(content);
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error reading file:', error);
      Alert.alert('Error', 'Failed to read file.');
    }
  };

  const deleteItem = async (itemName: string, isFile: boolean) => {
    try {
      const itemPath = `${basePath}/${itemName}${isFile ? '.txt' : ''}`;
      await RNFS.unlink(itemPath);
      loadFilesAndFolders();
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item.');
    }
  };

  useEffect(() => {
    loadFilesAndFolders();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter Folder Name"
        value={folderName}
        onChangeText={setFolderName}
        style={styles.input}
      />
      <TouchableOpacity onPress={createFolder} style={styles.button}>
        <Text style={styles.buttonText}>Create Folder</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Enter File Name"
        value={fileName}
        onChangeText={setFileName}
        style={styles.input}
      />
      <TextInput
        placeholder="Enter File Content"
        value={fileContent}
        onChangeText={setFileContent}
        style={styles.input}
      />
      <TouchableOpacity onPress={createFile} style={styles.button}>
        <Text style={styles.buttonText}>Create File</Text>
      </TouchableOpacity>

      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Folders:</Text>
        <ScrollView style={styles.innerScrollContainer}>
          {folders.map((folder, index) => (
            <View key={index} style={styles.itemContainer}>
              <Icon name="folder" size={40} color="yellow" />
              <Text style={styles.itemText}>{folder}</Text>
              <TouchableOpacity onPress={() => deleteItem(folder, false)}>
                <Icon name="trash" size={30} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        <Text style={styles.sectionTitle}>Files:</Text>
        <ScrollView style={styles.innerScrollContainer}>
          {files.map((file, index) => (
            <View key={index} style={styles.itemContainer}>
              <Icon name="document" size={40} color="yellow" />
              <Text style={styles.itemText}>{file}</Text>
              <TouchableOpacity onPress={() => readFile(file)}>
                <Icon name="eye" size={30} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteItem(file.replace('.txt', ''), true)}>
                <Icon name="trash" size={30} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>File Content:</Text>
          <Text>{selectedFile}</Text>
          <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  innerScrollContainer: {
    maxHeight: 200,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemText: {
    marginLeft: 10,
    flex: 1,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
});

export default FileFolderScreen;

// import React, {useState, useEffect} from 'react';
// import {
//   View,
//   TextInput,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   StyleSheet,
// } from 'react-native';
// import RNFS from 'react-native-fs';
// import Icon from 'react-native-vector-icons/Ionicons';

// const FileFolderScreen: React.FC = () => {
//   const [folderName, setFolderName] = useState<string>('');
//   const [fileName, setFileName] = useState<string>('');
//   const [fileContent, setFileContent] = useState<string>('');
//   const [files, setFiles] = useState<string[]>([]);
//   const [folders, setFolders] = useState<string[]>([]);
//   const [selectedFile, setSelectedFile] = useState<string | null>(null);
//   const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

//   const basePath = RNFS.DocumentDirectoryPath;

//   // Fetch all files and folders
//   const loadFilesAndFolders = async () => {
//     try {
//       const items = await RNFS.readDir(basePath);
//       const folderItems = items.filter(item => item.isDirectory());
//       const fileItems = items.filter(item => item.isFile());
//       setFolders(folderItems.map(folder => folder.name));
//       setFiles(fileItems.map(file => file.name));
//     } catch (error) {
//       console.error('Error loading files and folders:', error);
//       Alert.alert('Error', 'Failed to load files and folders.');
//     }
//   };

//   // Create Folder
//   const createFolder = async () => {
//     if (!folderName.trim()) {
//       Alert.alert('Error', 'Folder name is required.');
//       return;
//     }
//     try {
//       const folderPath = `${basePath}/${folderName}`;
//       await RNFS.mkdir(folderPath);
//       setFolderName('');
//       loadFilesAndFolders(); // Refresh
//     } catch (error) {
//       console.error('Error creating folder:', error);
//       Alert.alert('Error', 'Failed to create folder.');
//     }
//   };

//   // Create File
//   const createFile = async () => {
//     if (!fileName.trim() || !fileContent.trim() || !selectedFolder) {
//       Alert.alert(
//         'Error',
//         'File name, content, and folder selection are required.',
//       );
//       return;
//     }
//     try {
//       const filePath = `${basePath}/${selectedFolder}/${fileName}.txt`;
//       await RNFS.writeFile(filePath, fileContent, 'utf8');
//       setFileName('');
//       setFileContent('');
//       loadFilesAndFolders(); // Refresh
//     } catch (error) {
//       console.error('Error creating file:', error);
//       Alert.alert('Error', 'Failed to create file.');
//     }
//   };

//   // Read File (to view content)
//   const readFile = async (file: string) => {
//     try {
//       const filePath = `${basePath}/${selectedFolder}/${file}`;
//       const content = await RNFS.readFile(filePath, 'utf8');
//       setSelectedFile(content);
//     } catch (error) {
//       console.error('Error reading file:', error);
//       Alert.alert('Error', 'Failed to read file.');
//     }
//   };

//   // Update (Rename) File or Folder
//   const renameItem = async (
//     oldName: string,
//     newName: string,
//     isFile: boolean,
//   ) => {
//     if (!newName.trim()) {
//       Alert.alert('Error', 'New name is required.');
//       return;
//     }
//     try {
//       const oldPath = `${basePath}/${selectedFolder}/${oldName}`;
//       const newPath = `${basePath}/${selectedFolder}/${newName}${
//         isFile ? '.txt' : ''
//       }`;
//       await RNFS.moveFile(oldPath, newPath);
//       loadFilesAndFolders(); // Refresh
//     } catch (error) {
//       console.error('Error renaming item:', error);
//       Alert.alert('Error', 'Failed to rename item.');
//     }
//   };

//   // Delete File or Folder
//   const deleteItem = async (itemName: string, isFile: boolean) => {
//     try {
//       const itemPath = `${basePath}/${selectedFolder}/${itemName}${
//         isFile ? '.txt' : ''
//       }`;
//       await RNFS.unlink(itemPath);
//       if (isFile && selectedFile) {
//         setSelectedFile(null);
//       }
//       loadFilesAndFolders(); // Refresh
//     } catch (error) {
//       console.error('Error deleting item:', error);
//       Alert.alert('Error', 'Failed to delete item.');
//     }
//   };

//   // Load files and folders on component mount
//   useEffect(() => {
//     loadFilesAndFolders();
//   }, []);

//   return (
//     <View style={styles.container}>
//       {/* Input for creating folders */}
//       <TextInput
//         placeholder="Enter Folder Name"
//         value={folderName}
//         onChangeText={setFolderName}
//         style={styles.input}
//       />
//       <TouchableOpacity onPress={createFolder} style={styles.button}>
//         <Text style={styles.buttonText}>Create Folder</Text>
//       </TouchableOpacity>

//       {/* Input for creating files */}
//       <TextInput
//         placeholder="Enter File Name"
//         value={fileName}
//         onChangeText={setFileName}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Enter File Content"
//         value={fileContent}
//         onChangeText={setFileContent}
//         style={styles.input}
//       />
//       <TouchableOpacity onPress={createFile} style={styles.button}>
//         <Text style={styles.buttonText}>Create File</Text>
//       </TouchableOpacity>

//       <ScrollView>
//         <Text style={styles.sectionTitle}>Folders:</Text>
//         {folders.map((folder, index) => (
//           <View key={index} style={styles.itemContainer}>
//             <Icon name="folder" size={20} />
//             <Text style={styles.itemText}>{folder}</Text>
//             <TouchableOpacity onPress={() => setSelectedFolder(folder)}>
//               <Text style={styles.actionText}>Select</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={() => renameItem(folder, 'NewFolderName', false)}>
//               <Text style={styles.actionText}>Rename</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => deleteItem(folder, false)}>
//               <Text style={styles.actionText}>Delete</Text>
//             </TouchableOpacity>
//           </View>
//         ))}

//         {selectedFolder && (
//           <>
//             <Text style={styles.sectionTitle}>Files in {selectedFolder}:</Text>
//             {files.map((file, index) => (
//               <View key={index} style={styles.itemContainer}>
//                 <Icon name="document" size={20} />
//                 <Text style={styles.itemText}>{file}</Text>
//                 <TouchableOpacity onPress={() => readFile(file)}>
//                   <Text style={styles.actionText}>View</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() =>
//                     renameItem(file.replace('.txt', ''), 'NewFileName', true)
//                   }>
//                   <Text style={styles.actionText}>Rename</Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => deleteItem(file.replace('.txt', ''), true)}>
//                   <Text style={styles.actionText}>Delete</Text>
//                 </TouchableOpacity>
//               </View>
//             ))}
//           </>
//         )}
//       </ScrollView>

//       {/* Display selected file content */}
//       {selectedFile && (
//         <View style={styles.fileContentContainer}>
//           <Text style={styles.fileContentTitle}>File Content:</Text>
//           <Text>{selectedFile}</Text>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   input: {
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     padding: 10,
//     borderRadius: 5,
//     backgroundColor: '#fff',
//   },
//   button: {
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   itemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   itemText: {
//     marginLeft: 10,
//     flex: 1,
//   },
//   actionText: {
//     color: '#007bff',
//     marginLeft: 10,
//   },
//   fileContentContainer: {
//     marginTop: 20,
//   },
//   fileContentTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default FileFolderScreen;
