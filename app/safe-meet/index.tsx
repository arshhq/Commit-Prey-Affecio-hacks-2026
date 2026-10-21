import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { ToggleRow } from "@/components/ui/ToggleRow";
import { colors, radii, spacing } from "@/constants/theme";
import { useSettingsStore } from "@/store/settings";

const SAMPLE_PLACES = [
  { name: "Blue Bottle Coffee — Downtown", note: "Busy café · public seating" },
  { name: "City Library Plaza", note: "Daytime crowds · open space" },
  { name: "Museum Courtyard", note: "Staffed venue · clear exits" },
];

export default function SafeMeetScreen() {
  const meetPlan = useSettingsStore((s) => s.meetPlan);
  const setMeetPlan = useSettingsStore((s) => s.setMeetPlan);
  const toggleChecklist = useSettingsStore((s) => s.toggleChecklist);
  const done = Object.values(meetPlan.checklist).filter(Boolean).length;

  return (
    <Screen scroll>
      <Text muted style={{ maxWidth: 520 }}>
        Guided plan for a public first meet. Map pins are sample data — not live GPS or emergency dispatch.
      </Text>

      <Card padded={false} style={{ marginTop: spacing.lg, overflow: "hidden" }}>
        <LinearGradient colors={["#1A2440", "#14201C"]} style={styles.map}>
          <View style={[styles.pin, { top: 40, left: 48 }]} />
          <View style={[styles.pin, { top: 78, left: 150 }]} />
          <View style={[styles.pin, { top: 110, left: 96 }]} />
          <Text variant="caption" color={colors.cyan} style={styles.mapLabel}>
            SAMPLE MAP · demo pins only
          </Text>
        </LinearGradient>
        <View style={{ padding: spacing.md }}>
          <Text variant="subtitle">{meetPlan.placeName}</Text>
          <Text muted style={{ marginTop: 4 }}>
            {meetPlan.placeNote}
          </Text>
          <Text variant="caption" color={colors.violetSoft} style={{ marginTop: 8 }}>
            Checklist {done}/4
          </Text>
        </View>
      </Card>

      <Text variant="subtitle" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
        1 · Choose a public place
      </Text>
      <View style={styles.places}>
        {SAMPLE_PLACES.map((place) => (
          <Button
            key={place.name}
            label={place.name}
            size="sm"
            variant={meetPlan.placeName === place.name ? "primary" : "secondary"}
            onPress={() => setMeetPlan({ placeName: place.name, placeNote: place.note })}
            style={{ marginBottom: spacing.sm }}
          />
        ))}
      </View>

      <Text variant="subtitle" style={{ marginTop: spacing.md, marginBottom: spacing.sm }}>
        2 · Safety checklist
      </Text>
      <Card>
        <ToggleRow
          title="Review safety tips"
          description="Public place, own transport, tell someone"
          value={meetPlan.checklist.safetyTips}
          onChange={() => toggleChecklist("safetyTips")}
        />
        <ToggleRow
          title="Share plan with a friend"
          description="Demo reminder — does not send live location"
          value={meetPlan.checklist.shareWithFriend}
          onChange={() => toggleChecklist("shareWithFriend")}
        />
        <ToggleRow
          title="Confirm emergency contacts"
          description="Local checklist item only"
          value={meetPlan.checklist.emergencyContacts}
          onChange={() => toggleChecklist("emergencyContacts")}
        />
        <ToggleRow
          title="Set a check-in reminder"
          description="Preference only — not a background tracker"
          value={meetPlan.checklist.checkInReminder}
          onChange={() => toggleChecklist("checkInReminder")}
        />
      </Card>

      <Text variant="subtitle" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
        3 · Trusted contact
      </Text>
      <Card style={{ gap: spacing.md }}>
        <Input
          label="Friend name"
          value={meetPlan.friendName}
          onChangeText={(friendName) => setMeetPlan({ friendName })}
          placeholder="Sam"
        />
        <Input
          label="Notes / itinerary"
          value={meetPlan.notes}
          onChangeText={(notes) => setMeetPlan({ notes })}
          placeholder="Arrive 6:30 · leave by 8"
          multiline
        />
        <Text variant="micro" muted>
          Live location sharing and emergency services are not active in this MVP.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 160,
    justifyContent: "flex-end",
    padding: spacing.md,
  },
  pin: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.violet,
    borderWidth: 2,
    borderColor: "#fff",
  },
  mapLabel: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  places: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
});
