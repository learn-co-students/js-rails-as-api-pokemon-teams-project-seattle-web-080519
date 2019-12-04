class PokemonsController < ApplicationController

  def index
    # pokemons = Pokemon.all
    # options = {
    #   include: [:trainer]
    # }
    # render json: PokemonSerializer.new(pokemons, options)
   
    pokemons = Pokemon.all
      options = {
          include: [:trainer]
        }
      render json: pokemons, only: [:id, :species, :nickname],
      include: {
          trainer: {only: [:id, :name]}
      }
  end

  def show
    pokemon = Pokemon.find_by(id: params[:id])
    options = {
      include: [:trainer]
    }
    # render json: PokemonSerializer.new(pokemon, options)
    render json: pokemon, only: [:id, :name], include: {pokemons: {only: [:id, :nickname, :species, :trainer_id]}}
  end

  def new
  end

  def create
    trainer = Trainer.find_by(id: params[:trainer_id])
    if trainer.nil?
      puts "Trainer not found"
    end
    if trainer.pokemons.count < 6
      pokemon = Pokemon.new(nickname: Faker::Name.first_name, species: Faker::Games::Pokemon.name, trainer_id: params[:trainer_id])
      if pokemon.save
        puts "Pokemon saved!"
        render json: pokemon, only: [:id, :species, :nickname, :trainer_id]
      else
        puts pokemon.errors.full_messages
      end
    else
      puts "Can't have more than 6 pokemons"
    end
  end

  def destroy
    pokemon = Pokemon.find_by(id: params[:id])
    if pokemon.nil?
      puts "Pokemon not found"
      render json: "Pokemon destroyed"
    end
    if pokemon.destroy
      puts "pokemon destroyed"
      render json: pokemon, only: [:id, :nickname, :species, :trainer_id]
    else
      puts pokemon.errors.full_messages
    end
  end

end
