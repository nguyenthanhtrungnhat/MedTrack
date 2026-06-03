import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    visible: boolean;
    onClose: () => void;
    data: any[];
    searchKey: string;
    displayKey: string;
    subDisplayKey?: string;
    onSelect: (item: any) => void;
    title: string;
    placeholder?: string;
};

export default function SearchSelectModal({ visible, onClose, data, searchKey, displayKey, subDisplayKey, onSelect, title, placeholder }: Props) {
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<any[]>([]);

    useEffect(() => {
        if (visible) {
            setSearchText('');
            setFilteredData(data.slice(0, 50)); // Limit initial render
        }
    }, [visible, data]);

    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredData(data.slice(0, 50));
        } else {
            const lowerSearch = searchText.toLowerCase();
            const filtered = data.filter(item => {
                const text = String(item[searchKey] || '').toLowerCase();
                return text.includes(lowerSearch);
            });
            setFilteredData(filtered.slice(0, 50));
        }
    }, [searchText, data]);

    const handleSelect = (item: any) => {
        onSelect(item);
        onClose();
    };

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={28} color="#002677" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{title}</Text>
                    <View style={{ width: 28 }} />
                </View>

                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#a0aec0" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={placeholder || 'Tìm kiếm...'}
                        value={searchText}
                        onChangeText={setSearchText}
                        autoFocus
                    />
                    {searchText.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchText('')}>
                            <Ionicons name="close-circle" size={20} color="#cbd5e0" />
                        </TouchableOpacity>
                    )}
                </View>

                <FlatList
                    data={filteredData}
                    keyExtractor={(_, index) => index.toString()}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
                            <Text style={styles.itemTitle}>{item[displayKey]}</Text>
                            {subDisplayKey && <Text style={styles.itemSubtitle}>{item[subDisplayKey]}</Text>}
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Không tìm thấy kết quả.</Text>}
                />
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#002677' },
    closeBtn: { padding: 4 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 15, paddingHorizontal: 15, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' },
    searchIcon: { marginRight: 10 },
    searchInput: { flex: 1, height: 45, fontSize: 16 },
    item: { backgroundColor: '#fff', padding: 15, borderBottomWidth: 1, borderBottomColor: '#edf2f7' },
    itemTitle: { fontSize: 16, color: '#2d3748', fontWeight: '500' },
    itemSubtitle: { fontSize: 13, color: '#718096', marginTop: 4 },
    emptyText: { textAlign: 'center', color: '#a0aec0', marginTop: 30, fontSize: 15 },
});
