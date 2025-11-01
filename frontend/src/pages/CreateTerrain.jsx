import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const CreateTerrain = () => {
  return (
    <div className="container-custom py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ajouter un terrain</h1>
        
        <Card className="p-6">
          <form className="space-y-4">
            <Input label="Nom du terrain" required />
            <Input label="Ville" required />
            <Input label="Prix par heure (FCFA)" type="number" required />
            <Button type="submit">Créer le terrain</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CreateTerrain;

