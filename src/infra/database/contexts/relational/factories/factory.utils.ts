import { faker } from '@faker-js/faker';
import {
  Model,
  ModelStatic,
  DataTypes,
  ArrayDataType,
  EnumDataType,
} from 'sequelize';
import { MakeNullishOptional } from 'sequelize/types/utils';

export const createEntity = async <T extends Model>(
  model: ModelStatic<T>,
  overrides: MakeNullishOptional<T['_attributes']> = {} as MakeNullishOptional<
    T['_attributes']
  >,
  bulk: boolean = false,
  quantity: number = 1,
) => {
  if (bulk) {
    return createEntities(model, overrides, quantity);
  }

  const attributes = model.getAttributes();

  const data: MakeNullishOptional<T['_attributes']> = Object.keys(
    attributes,
  ).reduce(
    (result, key) => {
      const attribute = attributes[key];
      const columnType = attribute.type;

      result[key as keyof T['_attributes']] =
        overrides[key as keyof T['_attributes']] !== undefined
          ? overrides[key as keyof T['_attributes']]
          : generateFakeData(columnType);
      return result;
    },
    {} as MakeNullishOptional<T['_attributes']>,
  );

  return model.create(data);
};

const createEntities = async <T extends Model>(
  model: ModelStatic<T>,
  overrides: MakeNullishOptional<T['_attributes']> = {} as MakeNullishOptional<
    T['_attributes']
  >,
  quantity: number,
) => {
  const entitiesData = [];

  for (let i = 0; i < quantity; i++) {
    entitiesData.push(await createEntity(model, overrides));
  }

  return entitiesData;
};

/**
 * Creates an entity with its related entities based on model associations
 *
 * @param model The model class to create an entity for
 * @param overrides Optional overrides for the entity attributes
 * @param relations Configuration for related entities
 * @param bulk Whether to create multiple entities
 * @param quantity Number of entities to create if bulk is true
 * @returns The created entity or entities with their relations
 */
/**
 * Automatically detects model relationships from the model's associations
 *
 * @param model The model class to detect relationships for
 * @returns Object containing the detected relationships
 */
export const detectModelRelationships = (model: ModelStatic<any>) => {
  const relationships: {
    [key: string]: {
      model: ModelStatic<any>;
      type: 'hasMany' | 'belongsTo' | 'belongsToMany';
    };
  } = {};

  // Get all associations from the model
  const associations = (model as any).associations || {};

  // Process each association
  for (const [key, association] of Object.entries(associations)) {
    const associationType = (association as any).associationType;
    const target = (association as any).target;

    if (associationType === 'HasMany') {
      relationships[key] = {
        model: target,
        type: 'hasMany',
      };
    } else if (associationType === 'BelongsTo') {
      relationships[key] = {
        model: target,
        type: 'belongsTo',
      };
    } else if (associationType === 'BelongsToMany') {
      relationships[key] = {
        model: target,
        type: 'belongsToMany',
      };
    }
  }

  return relationships;
};

/**
 * Creates an entity with its related entities based on model associations
 *
 * @param model The model class to create an entity for
 * @param overrides Optional overrides for the entity attributes
 * @param relations Configuration for related entities
 * @param bulk Whether to create multiple entities
 * @param quantity Number of entities to create if bulk is true
 * @param autoDetectRelations Whether to automatically detect and create related entities
 * @returns The created entity or entities with their relations
 */
export const createEntityWithRelations = async <T extends Model>(
  model: ModelStatic<T>,
  overrides: MakeNullishOptional<T['_attributes']> = {} as MakeNullishOptional<
    T['_attributes']
  >,
  relations: {
    [key: string]: {
      model: ModelStatic<any>;
      type: 'hasMany' | 'belongsTo' | 'belongsToMany';
      overrides?: any;
      quantity?: number;
    };
  } = {},
  bulk: boolean = false,
  quantity: number = 1,
  autoDetectRelations: boolean = false,
) => {
  if (bulk) {
    return createEntitiesWithRelations(
      model,
      overrides,
      relations,
      quantity,
      autoDetectRelations,
    );
  }

  // Create the main entity first
  const entity = (await createEntity(model, overrides)) as T & { uuid: string };

  // Auto-detect relationships if requested
  if (autoDetectRelations) {
    const detectedRelations = detectModelRelationships(model);

    // Merge detected relations with provided relations
    for (const [key, config] of Object.entries(detectedRelations)) {
      if (!relations[key]) {
        relations[key] = {
          ...config,
          quantity: 1,
        };
      }
    }
  }

  // Process each relationship
  for (const [relationKey, relationConfig] of Object.entries(relations)) {
    const {
      model: relatedModel,
      type,
      overrides: relatedOverrides = {},
      quantity: relatedQuantity = 1,
    } = relationConfig;

    if (type === 'hasMany' || type === 'belongsToMany') {
      // For hasMany/belongsToMany, create multiple related entities
      const relatedEntities = await createEntities(
        relatedModel,
        {
          ...relatedOverrides,
          // Associate with the parent entity
          [`${model.name.replace('Model', '').toLowerCase()}Id`]: entity.uuid,
        },
        relatedQuantity,
      );
      entity[relationKey] = relatedEntities;
    } else if (type === 'belongsTo') {
      // For belongsTo, create one related entity
      const relatedEntity = (await createEntity(
        relatedModel,
        relatedOverrides,
      )) as Model & { uuid: string };
      entity[`${relationKey}Id`] = relatedEntity.uuid;
      entity[relationKey] = relatedEntity;
      await entity.save();
    }
  }

  return entity;
};

/**
 * Creates multiple entities with their related entities based on model associations
 *
 * @param model The model class to create entities for
 * @param overrides Optional overrides for the entity attributes
 * @param relations Configuration for related entities
 * @param quantity Number of entities to create
 * @returns Array of created entities with their relations
 */
/**
 * Creates multiple entities with their related entities based on model associations
 *
 * @param model The model class to create entities for
 * @param overrides Optional overrides for the entity attributes
 * @param relations Configuration for related entities
 * @param quantity Number of entities to create
 * @param autoDetectRelations Whether to automatically detect and create related entities
 * @returns Array of created entities with their relations
 */
const createEntitiesWithRelations = async <T extends Model>(
  model: ModelStatic<T>,
  overrides: MakeNullishOptional<T['_attributes']> = {} as MakeNullishOptional<
    T['_attributes']
  >,
  relations: {
    [key: string]: {
      model: ModelStatic<any>;
      type: 'hasMany' | 'belongsTo' | 'belongsToMany';
      overrides?: any;
      quantity?: number;
    };
  } = {},
  quantity: number,
  autoDetectRelations: boolean = false,
) => {
  const entitiesData = [];

  for (let i = 0; i < quantity; i++) {
    entitiesData.push(
      await createEntityWithRelations(
        model,
        overrides,
        relations,
        false,
        1,
        autoDetectRelations,
      ),
    );
  }

  return entitiesData;
};

const generateFakeData = (type: any) => {
  if (type instanceof DataTypes.STRING) {
    return faker.lorem.word();
  }
  if (type instanceof DataTypes.TEXT) {
    return faker.lorem.words(10);
  }
  if (type instanceof DataTypes.INTEGER || type instanceof DataTypes.BIGINT) {
    return faker.number.int();
  }
  if (type instanceof DataTypes.FLOAT || type instanceof DataTypes.DECIMAL) {
    return faker.number.float({ min: 0, max: 1000 });
  }
  if (type instanceof DataTypes.BOOLEAN) {
    return faker.datatype.boolean();
  }
  if (type instanceof DataTypes.DATE) {
    return faker.date.recent();
  }
  if (type instanceof DataTypes.DATEONLY) {
    return faker.date.recent().toISOString().split('T')[0];
  }
  if (type instanceof DataTypes.UUID) {
    return faker.string.uuid();
  }
  if (type instanceof DataTypes.ENUM) {
    const enumValues = (type as EnumDataType<string>).values;
    return faker.helpers.arrayElement(enumValues);
  }
  if (type instanceof DataTypes.ARRAY) {
    const arrayType = (type as ArrayDataType<any>).options.type;
    return [generateFakeData(arrayType)];
  }

  return faker.lorem.word();
};
