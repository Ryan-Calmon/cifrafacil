 function PrimeiraLetra({ name }) {
    if (!name || typeof name !== 'string') {
      return <div>No valid name provided.</div>;
    }
  
    const firstLetter = name.trim().charAt(0).toUpperCase();
  
    return (
      <div className="text-4xl font-bold">
        {firstLetter}
      </div>
    );
  }

  export default PrimeiraLetra