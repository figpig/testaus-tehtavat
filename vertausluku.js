/**
 * Laskee D'Hondtin vertausluvut yhdelle listalle
 * @param {Object[]} ehdokkaat - Taulukko ehdokasobjekteja, joissa numero, nimi ja äänimäärä
 * @returns {Object[]} - Sama taulukko, mutta lisättynä vertausluvuilla
 */
function laskeVertausluvut(ehdokkaat) {
  // Group candidates by vote count
  const grouped = ehdokkaat.reduce((groups, ehdokas) => {
    const key = ehdokas.aanet;
    if (!groups[key]) groups[key] = [];
    groups[key].push(ehdokas);
    return groups;
  }, {});

  // Randomize order within each group
  const randomizedGroups = Object.values(grouped).map(group => {
    if (group.length > 1) {
      group.sort(() => Math.random() - 0.5);
    }
    return group;
  });

  // Flatten the randomized groups and mark randomized candidates
  const randomizedCandidates = randomizedGroups.flat().map(ehdokas => ({
    ...ehdokas,
    arvottu: ehdokas.arvottu !== undefined ? ehdokas.arvottu : true,
  }));

  // Calculate total votes
  const totalVotes = randomizedCandidates.reduce((sum, ehdokas) => sum + ehdokas.aanet, 0);

  // Assign comparison numbers
  return randomizedCandidates.map((ehdokas, index) => ({
    ...ehdokas,
    vertausluku: totalVotes / (index + 1),
  }));
}

export default laskeVertausluvut;
export { laskeVertausluvut };
